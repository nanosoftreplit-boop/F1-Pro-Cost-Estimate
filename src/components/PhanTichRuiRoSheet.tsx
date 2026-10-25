import React, { useState, useMemo, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { WorkItem, ProjectSettings, Category } from '../types/estimate';
import { computeTHKP, formatVND } from '../utils/calculator';
import { 
  TrendingUp, AlertTriangle, ShieldCheck, RefreshCw, 
  Sliders, BarChart2, Layers, Download, CheckCircle2, 
  HelpCircle, Sparkles, Clock, ArrowUpRight, ArrowDownRight, Info
} from 'lucide-react';

interface PhanTichRuiRoSheetProps {
  items: WorkItem[];
  categories: Category[];
  settings: ProjectSettings;
}

export type RiskScenarioKey = 'baseline' | 'material_spike' | 'labor_wage_hike' | 'fuel_crisis' | 'schedule_delay' | 'worst_case';

interface RiskScenarioConfig {
  name: string;
  badge: string;
  desc: string;
  matSteelDelta: number; // %
  matConcreteDelta: number; // %
  laborDelta: number; // %
  machineDelta: number; // %
  delayMonths: number;
  inflationAnnual: number; // %
}

const PRESET_SCENARIOS: Record<RiskScenarioKey, RiskScenarioConfig> = {
  baseline: {
    name: 'Kịch bản Cơ sở (Chuẩn)',
    badge: 'Mặc định',
    desc: 'Giá cả và tiến độ theo hợp đồng ban đầu, không có đột biến thị trường.',
    matSteelDelta: 0,
    matConcreteDelta: 0,
    laborDelta: 0,
    machineDelta: 0,
    delayMonths: 0,
    inflationAnnual: 3.5,
  },
  material_spike: {
    name: 'Lạm phát & Biến động vật tư',
    badge: 'Rủi ro cao',
    desc: 'Giá sắt thép (+22%), xi măng (+15%), cát đá cát vàng (+18%) do khan hiếm nguồn cung.',
    matSteelDelta: 22,
    matConcreteDelta: 16,
    laborDelta: 5,
    machineDelta: 8,
    delayMonths: 1,
    inflationAnnual: 6.5,
  },
  labor_wage_hike: {
    name: 'Tăng lương & Thiếu nhân công',
    badge: 'Rủi ro nhân lực',
    desc: 'Điều chỉnh lương tối thiểu vùng và khan hiếm thợ bậc 3.5/7 - 4/7 cục bộ.',
    matSteelDelta: 4,
    matConcreteDelta: 4,
    laborDelta: 18,
    machineDelta: 6,
    delayMonths: 2,
    inflationAnnual: 4.8,
  },
  fuel_crisis: {
    name: 'Khủng hoảng nhiên liệu & Máy',
    badge: 'Nhiên liệu',
    desc: 'Giá dầu Diesel và xăng tăng vọt (+25%), đơn giá ca máy thi công tăng mạnh.',
    matSteelDelta: 6,
    matConcreteDelta: 5,
    laborDelta: 6,
    machineDelta: 24,
    delayMonths: 1,
    inflationAnnual: 5.2,
  },
  schedule_delay: {
    name: 'Chậm tiến độ thời tiết / GPMB',
    badge: 'Tiến độ kéo dài',
    desc: 'Mặt bằng bàn giao chậm 4 tháng, tăng chi phí nhà tạm, chi phí chung và trượt giá tích lũy.',
    matSteelDelta: 10,
    matConcreteDelta: 8,
    laborDelta: 12,
    machineDelta: 14,
    delayMonths: 4,
    inflationAnnual: 5.5,
  },
  worst_case: {
    name: 'Kịch bản Xấu nhất (Compound)',
    badge: 'Cảnh báo đỏ',
    desc: 'Cộng gộp khủng hoảng giá vật tư (+30%), nhân công (+20%), máy (+25%) và chậm 6 tháng.',
    matSteelDelta: 30,
    matConcreteDelta: 25,
    laborDelta: 20,
    machineDelta: 25,
    delayMonths: 6,
    inflationAnnual: 8.0,
  },
};

export const PhanTichRuiRoSheet: React.FC<PhanTichRuiRoSheetProps> = ({
  items,
  categories,
  settings,
}) => {
  const [selectedScenarioKey, setSelectedScenarioKey] = useState<RiskScenarioKey>('material_spike');
  
  // Custom slider values
  const [matSteelDelta, setMatSteelDelta] = useState<number>(22);
  const [matConcreteDelta, setMatConcreteDelta] = useState<number>(16);
  const [laborDelta, setLaborDelta] = useState<number>(8);
  const [machineDelta, setMachineDelta] = useState<number>(10);
  const [delayMonths, setDelayMonths] = useState<number>(2);
  const [inflationAnnual, setInflationAnnual] = useState<number>(5.5);
  const [simulationRuns, setSimulationRuns] = useState<number>(500);
  const [activeD3Tab, setActiveD3Tab] = useState<'distribution' | 'scurve' | 'sensitivity'>('distribution');

  // SVG Refs for D3
  const d3DistributionRef = useRef<SVGSVGElement | null>(null);
  const d3SCurveRef = useRef<SVGSVGElement | null>(null);

  // Compute Base THKP
  const baseTHKP = useMemo(() => computeTHKP(items, settings, categories), [items, settings, categories]);
  const baseGrandTotal = baseTHKP.grandTotal;
  const directMat = baseTHKP.directMaterial + baseTHKP.diffMaterial;
  const directLab = baseTHKP.directLabor + baseTHKP.diffLabor;
  const directMac = baseTHKP.directMachine + baseTHKP.diffMachine;

  // Change preset scenario
  const handleSelectScenario = (key: RiskScenarioKey) => {
    setSelectedScenarioKey(key);
    const cfg = PRESET_SCENARIOS[key];
    setMatSteelDelta(cfg.matSteelDelta);
    setMatConcreteDelta(cfg.matConcreteDelta);
    setLaborDelta(cfg.laborDelta);
    setMachineDelta(cfg.machineDelta);
    setDelayMonths(cfg.delayMonths);
    setInflationAnnual(cfg.inflationAnnual);
  };

  // Monte Carlo Simulation Engine
  const simulationResults = useMemo(() => {
    const runs = simulationRuns;
    const totals: number[] = [];

    // Tỷ trọng vật liệu thép (~45% chi phí vật liệu), bê tông/khác (~55%)
    const steelBase = directMat * 0.45;
    const concreteBase = directMat * 0.55;

    // Phép tính chi phí chung và gián tiếp phụ thuộc vào chi phí trực tiếp
    const indirectMultiplier = 1 + baseTHKP.generalCostRate + baseTHKP.temporaryCampRate + baseTHKP.unallocatedWorkRate;
    const taxAndContingencyMultiplier = (1 + baseTHKP.taxableProfitRate) * (1 + settings.vatRate) * (1 + baseTHKP.contingencyRate);

    // Box-Muller normal random generator
    function randomNormal(mean: number, stdDev: number) {
      let u = 0, v = 0;
      while (u === 0) u = Math.random();
      while (v === 0) v = Math.random();
      const num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
      return mean + num * stdDev;
    }

    // Thời gian trượt giá tích lũy = delayMonths / 12 * (inflationAnnual / 100)
    const baseTimelineMonths = 12;

    for (let i = 0; i < runs; i++) {
      // Mỗi biến số tuân theo phân phối chuẩn với độ lệch chuẩn 35% của giá trị delta
      const simSteelPct = randomNormal(matSteelDelta, Math.max(3, Math.abs(matSteelDelta) * 0.35)) / 100;
      const simConcretePct = randomNormal(matConcreteDelta, Math.max(2.5, Math.abs(matConcreteDelta) * 0.35)) / 100;
      const simLaborPct = randomNormal(laborDelta, Math.max(2, Math.abs(laborDelta) * 0.35)) / 100;
      const simMachinePct = randomNormal(machineDelta, Math.max(2.5, Math.abs(machineDelta) * 0.35)) / 100;
      const simDelay = Math.max(0, randomNormal(delayMonths, 1.0));
      const simInflationRate = Math.max(1, randomNormal(inflationAnnual, 1.2)) / 100;

      // Chi phí trực tiếp sau biến động
      const simMat = steelBase * (1 + simSteelPct) + concreteBase * (1 + simConcretePct);
      const simLab = directLab * (1 + simLaborPct);
      const simMac = directMac * (1 + simMachinePct);
      const simDirect = simMat + simLab + simMac;

      // Trượt giá theo thời gian trễ
      const timeInflationFactor = 1 + (simDelay / 12) * simInflationRate;

      // Chi phí xây dựng tổng cộng có tính trượt giá thời gian
      const simTotal = simDirect * indirectMultiplier * taxAndContingencyMultiplier * timeInflationFactor;
      totals.push(simTotal);
    }

    totals.sort((a, b) => a - b);

    const mean = totals.reduce((s, v) => s + v, 0) / runs;
    const variance = totals.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / runs;
    const stdDev = Math.sqrt(variance);

    const p10 = totals[Math.floor(runs * 0.10)];
    const p50 = totals[Math.floor(runs * 0.50)];
    const p80 = totals[Math.floor(runs * 0.80)];
    const p90 = totals[Math.floor(runs * 0.90)];
    const p95 = totals[Math.floor(runs * 0.95)];

    const var95 = Math.max(0, p95 - baseGrandTotal);
    const recommendedContingency = Math.max(0, p80 - baseGrandTotal);

    return {
      totals,
      mean,
      stdDev,
      min: totals[0],
      max: totals[runs - 1],
      p10,
      p50,
      p80,
      p90,
      p95,
      var95,
      recommendedContingency,
    };
  }, [
    directMat, directLab, directMac, baseTHKP, settings.vatRate, baseGrandTotal,
    matSteelDelta, matConcreteDelta, laborDelta, machineDelta, delayMonths, inflationAnnual, simulationRuns
  ]);

  // S-Curve Cashflow generator
  const scurveData = useMemo(() => {
    const totalMonths = 12 + Math.max(0, delayMonths);
    const data: { month: number; label: string; baseMonthly: number; baseCum: number; simMonthly: number; simCum: number }[] = [];

    let cumBase = 0;
    let cumSim = 0;
    const simTarget = simulationResults.mean;

    // S-curve shape distribution using Sigmoid / Beta cumulative distribution
    function sWeight(t: number, total: number) {
      const x = (t / total) * 6 - 3;
      return 1 / (1 + Math.exp(-x));
    }

    let prevWeight = 0;
    for (let m = 1; m <= 12; m++) {
      const curWeight = sWeight(m, 12);
      const incWeight = curWeight - prevWeight;
      prevWeight = curWeight;
      const baseMonthCost = baseGrandTotal * incWeight;
      cumBase += baseMonthCost;

      data.push({
        month: m,
        label: `Tháng ${m}`,
        baseMonthly: baseMonthCost,
        baseCum: cumBase,
        simMonthly: 0,
        simCum: 0
      });
    }

    // Extended timeline for simulated scenario
    let prevSimWeight = 0;
    for (let m = 1; m <= totalMonths; m++) {
      const curWeight = sWeight(m, totalMonths);
      const incWeight = curWeight - prevSimWeight;
      prevSimWeight = curWeight;
      const simMonthCost = simTarget * incWeight;
      cumSim += simMonthCost;

      if (m <= 12) {
        data[m - 1].simMonthly = simMonthCost;
        data[m - 1].simCum = cumSim;
      } else {
        data.push({
          month: m,
          label: `Tháng ${m} (Trễ)`,
          baseMonthly: 0,
          baseCum: baseGrandTotal,
          simMonthly: simMonthCost,
          simCum: cumSim
        });
      }
    }

    return data;
  }, [baseGrandTotal, simulationResults.mean, delayMonths]);

  // Sensitivity Ranking Data
  const sensitivityRanking = useMemo(() => {
    const deltaFactor = 0.10; // +10% shock on each factor
    const matImpact = directMat * deltaFactor * 1.35;
    const laborImpact = directLab * deltaFactor * 1.35;
    const machineImpact = directMac * deltaFactor * 1.35;
    const delayImpact = (baseGrandTotal * (inflationAnnual / 100)) * (1 / 12);

    const list = [
      { name: 'Vật tư xây dựng (Thép & Xi măng)', category: 'Vật liệu', impactVND: matImpact, elasticity: (matImpact / baseGrandTotal) * 100, color: '#ef4444' },
      { name: 'Chi phí Nhân công', category: 'Nhân công', impactVND: laborImpact, elasticity: (laborImpact / baseGrandTotal) * 100, color: '#f59e0b' },
      { name: 'Giá ca máy & Nhiên liệu Diesel', category: 'Máy thi công', impactVND: machineImpact, elasticity: (machineImpact / baseGrandTotal) * 100, color: '#3b82f6' },
      { name: 'Trượt giá theo thời gian trễ (1 tháng)', category: 'Tiến độ', impactVND: delayImpact, elasticity: (delayImpact / baseGrandTotal) * 100, color: '#8b5cf6' },
    ];
    return list.sort((a, b) => b.impactVND - a.impactVND);
  }, [directMat, directLab, directMac, baseGrandTotal, inflationAnnual]);

  // -------------------------------------------------------------
  // D3 Chart 1: Probability Distribution Render (Monte Carlo Histogram & PDF)
  // -------------------------------------------------------------
  useEffect(() => {
    if (activeD3Tab !== 'distribution' && activeD3Tab !== 'sensitivity') return;
    const svgEl = d3DistributionRef.current;
    if (!svgEl) return;

    const svg = d3.select(svgEl);
    svg.selectAll('*').remove();

    const width = 760;
    const height = 300;
    const margin = { top: 30, right: 35, bottom: 45, left: 65 };

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const values = simulationResults.totals;
    if (!values || values.length === 0) return;

    // Scale X
    const x = d3.scaleLinear()
      .domain([d3.min(values)! * 0.96, d3.max(values)! * 1.04])
      .range([0, innerWidth]);

    // Bins for histogram
    const histogram = d3.bin()
      .value((d) => d)
      .domain(x.domain() as [number, number])
      .thresholds(x.ticks(35));

    const bins = histogram(values);

    // Scale Y
    const y = d3.scaleLinear()
      .domain([0, (d3.max(bins, d => d.length) || 1) * 1.15])
      .range([innerHeight, 0]);

    // Defs: Gradients
    const defs = svg.append('defs');
    const areaGradient = defs.append('linearGradient')
      .attr('id', 'distGradient')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '100%');

    areaGradient.append('stop').attr('offset', '0%').attr('stop-color', '#3b82f6').attr('stop-opacity', 0.55);
    areaGradient.append('stop').attr('offset', '100%').attr('stop-color', '#3b82f6').attr('stop-opacity', 0.05);

    // Draw Histogram bars
    g.selectAll('.bar')
      .data(bins)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.x0 || 0) + 1)
      .attr('y', d => y(d.length))
      .attr('width', d => Math.max(0, x(d.x1 || 0) - x(d.x0 || 0) - 1))
      .attr('height', d => innerHeight - y(d.length))
      .attr('fill', d => {
        const mid = ((d.x0 || 0) + (d.x1 || 0)) / 2;
        if (mid <= baseGrandTotal) return '#10b981';
        if (mid <= simulationResults.p80) return '#3b82f6';
        if (mid <= simulationResults.p90) return '#f59e0b';
        return '#ef4444';
      })
      .attr('opacity', 0.7)
      .attr('rx', 2);

    // Density curve line generator
    const densityPoints = bins.map(b => ({
      x: ((b.x0 || 0) + (b.x1 || 0)) / 2,
      y: b.length
    }));

    const lineGen = d3.line<{ x: number; y: number }>()
      .x(d => x(d.x))
      .y(d => y(d.y))
      .curve(d3.curveBasis);

    g.append('path')
      .datum(densityPoints)
      .attr('fill', 'none')
      .attr('stroke', '#1d4ed8')
      .attr('stroke-width', 2.5)
      .attr('d', lineGen);

    // X Axis
    const xAxis = d3.axisBottom(x)
      .ticks(6)
      .tickFormat(d => `${((d as number) / 1e9).toFixed(2)} tỷ`);

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .attr('color', '#64748b')
      .style('font-size', '11px');

    // Y Axis
    const yAxis = d3.axisLeft(y)
      .ticks(5);

    g.append('g')
      .call(yAxis)
      .attr('color', '#64748b')
      .style('font-size', '11px');

    // Mark Baseline
    const xBase = x(baseGrandTotal);
    if (xBase >= 0 && xBase <= innerWidth) {
      g.append('line')
        .attr('x1', xBase).attr('x2', xBase)
        .attr('y1', 0).attr('y2', innerHeight)
        .attr('stroke', '#10b981')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '4,4');

      g.append('text')
        .attr('x', xBase - 4)
        .attr('y', 14)
        .attr('text-anchor', 'end')
        .attr('fill', '#059669')
        .style('font-size', '10px')
        .style('font-weight', 'bold')
        .text('Cơ sở: ' + formatVND(baseGrandTotal));
    }

    // Mark P80
    const xP80 = x(simulationResults.p80);
    if (xP80 >= 0 && xP80 <= innerWidth) {
      g.append('line')
        .attr('x1', xP80).attr('x2', xP80)
        .attr('y1', 0).attr('y2', innerHeight)
        .attr('stroke', '#f59e0b')
        .attr('stroke-width', 2);

      g.append('text')
        .attr('x', xP80 + 4)
        .attr('y', 28)
        .attr('text-anchor', 'start')
        .attr('fill', '#d97706')
        .style('font-size', '10px')
        .style('font-weight', 'bold')
        .text('P80 (Khuyến nghị): ' + formatVND(simulationResults.p80));
    }

    // Mark P90
    const xP90 = x(simulationResults.p90);
    if (xP90 >= 0 && xP90 <= innerWidth) {
      g.append('line')
        .attr('x1', xP90).attr('x2', xP90)
        .attr('y1', 0).attr('y2', innerHeight)
        .attr('stroke', '#ef4444')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '3,3');

      g.append('text')
        .attr('x', xP90 + 4)
        .attr('y', 44)
        .attr('text-anchor', 'start')
        .attr('fill', '#dc2626')
        .style('font-size', '10px')
        .style('font-weight', 'bold')
        .text('P90 (An toàn cao): ' + formatVND(simulationResults.p90));
    }

  }, [simulationResults, baseGrandTotal, activeD3Tab]);

  // -------------------------------------------------------------
  // D3 Chart 2: S-Curve Over Time Render (Baseline vs Simulated Scenario)
  // -------------------------------------------------------------
  useEffect(() => {
    if (activeD3Tab !== 'scurve') return;
    const svgEl = d3SCurveRef.current;
    if (!svgEl) return;

    const svg = d3.select(svgEl);
    svg.selectAll('*').remove();

    const width = 760;
    const height = 300;
    const margin = { top: 35, right: 35, bottom: 45, left: 65 };

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const data = scurveData;
    if (!data || data.length === 0) return;

    // Scale X
    const x = d3.scalePoint()
      .domain(data.map(d => d.label))
      .range([0, innerWidth])
      .padding(0.3);

    // Scale Y
    const maxVal = d3.max(data, d => Math.max(d.baseCum, d.simCum)) || 1;
    const y = d3.scaleLinear()
      .domain([0, maxVal * 1.1])
      .range([innerHeight, 0]);

    // Gridlines
    g.append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.15)
      .call(d3.axisLeft(y).ticks(5).tickSize(-innerWidth).tickFormat(() => ''));

    // Area Generator for simulated curve
    const areaSim = d3.area<typeof data[0]>()
      .x(d => x(d.label) || 0)
      .y0(innerHeight)
      .y1(d => y(d.simCum))
      .curve(d3.curveMonotoneX);

    // Defs: Gradients
    const defs = svg.append('defs');
    const scurveGrad = defs.append('linearGradient')
      .attr('id', 'scurveGrad')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '100%');

    scurveGrad.append('stop').attr('offset', '0%').attr('stop-color', '#ef4444').attr('stop-opacity', 0.25);
    scurveGrad.append('stop').attr('offset', '100%').attr('stop-color', '#ef4444').attr('stop-opacity', 0.02);

    g.append('path')
      .datum(data)
      .attr('fill', 'url(#scurveGrad)')
      .attr('d', areaSim);

    // Line 1: Baseline S-curve
    const lineBase = d3.line<typeof data[0]>()
      .x(d => x(d.label) || 0)
      .y(d => y(d.baseCum))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#10b981')
      .attr('stroke-width', 2.5)
      .attr('stroke-dasharray', '5,5')
      .attr('d', lineBase);

    // Line 2: Simulated Scenario S-curve
    const lineSim = d3.line<typeof data[0]>()
      .x(d => x(d.label) || 0)
      .y(d => y(d.simCum))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#ef4444')
      .attr('stroke-width', 3)
      .attr('d', lineSim);

    // Dots on points
    g.selectAll('.dot-base')
      .data(data.filter((_, idx) => idx % 2 === 0))
      .enter()
      .append('circle')
      .attr('cx', d => x(d.label) || 0)
      .attr('cy', d => y(d.baseCum))
      .attr('r', 3.5)
      .attr('fill', '#10b981');

    g.selectAll('.dot-sim')
      .data(data.filter((_, idx) => idx % 2 === 0))
      .enter()
      .append('circle')
      .attr('cx', d => x(d.label) || 0)
      .attr('cy', d => y(d.simCum))
      .attr('r', 4)
      .attr('fill', '#ef4444');

    // Axes
    const xAxis = d3.axisBottom(x);
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .attr('color', '#64748b')
      .selectAll('text')
      .style('font-size', '10px')
      .attr('transform', 'rotate(-25)')
      .attr('text-anchor', 'end');

    const yAxis = d3.axisLeft(y)
      .ticks(5)
      .tickFormat(d => `${((d as number) / 1e9).toFixed(2)} tỷ`);

    g.append('g')
      .call(yAxis)
      .attr('color', '#64748b')
      .style('font-size', '11px');

  }, [scurveData, activeD3Tab]);

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-y-auto select-none">
      {/* 1. Header Ribbon & Overview */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-rose-50 text-rose-600 rounded-md border border-rose-200">
                <BarChart2 className="w-5 h-5" />
              </span>
              <div>
                <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  Phân Tích Rủi Ro & Mô Phỏng Biến Động Ngân Sách Dự Toán
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold border border-blue-200">
                    Monte Carlo D3
                  </span>
                </h1>
                <p className="text-xs text-slate-500">
                  Mô phỏng 500+ kịch bản trượt giá vật tư, biến động nhân công, nhiên liệu máy và trễ tiến độ theo tiêu chuẩn Nghị định 10/2021/NĐ-CP & TT 11/2021/TT-BXD
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSelectScenario('baseline')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Về Kịch bản Cơ sở
            </button>
            <button
              onClick={() => {
                const reportContent = `BÁO CÁO PHÂN TÍCH RỦI RO DỰ TOÁN CÔNG TRÌNH\n` +
                  `Dự án: ${settings.projectName}\n` +
                  `Địa điểm: ${settings.locationProvince} (Vùng ${settings.salaryRegion})\n` +
                  `Ngân sách cơ sở (G_0): ${formatVND(baseGrandTotal)}\n` +
                  `Ngân sách kỳ vọng (Mean): ${formatVND(simulationResults.mean)}\n` +
                  `Mức tin cậy P80: ${formatVND(simulationResults.p80)}\n` +
                  `Mức tin cậy P90: ${formatVND(simulationResults.p90)}\n` +
                  `Quỹ dự phòng rủi ro khuyến nghị: ${formatVND(simulationResults.recommendedContingency)}\n` +
                  `Giá trị chịu rủi ro (VaR 95%): ${formatVND(simulationResults.var95)}`;
                const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Bao_Cao_Rui_Ro_${settings.projectName.replace(/\s+/g, '_')}.txt`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Xuất Báo Cáo Rủi Ro
            </button>
          </div>
        </div>

        {/* Preset Scenarios Selector Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 mt-4 pt-4 border-t border-slate-100">
          {(Object.keys(PRESET_SCENARIOS) as RiskScenarioKey[]).map(key => {
            const sc = PRESET_SCENARIOS[key];
            const isSelected = selectedScenarioKey === key;
            return (
              <button
                key={key}
                onClick={() => handleSelectScenario(key)}
                className={`p-2.5 rounded-lg border text-left transition-all relative ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50/70 shadow-sm ring-1 ring-blue-500'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    key === 'baseline' ? 'bg-emerald-100 text-emerald-700' :
                    key === 'worst_case' ? 'bg-rose-100 text-rose-700 font-extrabold' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {sc.badge}
                  </span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                </div>
                <div className="font-bold text-xs text-slate-800 line-clamp-1">{sc.name}</div>
                <div className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-tight">
                  {sc.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Key Metrics & Value-at-Risk Summary Cards */}
      <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-xs font-semibold text-slate-500">Ngân sách Cơ sở (G₀)</div>
            <div className="text-xl font-black text-slate-800 mt-1">
              {formatVND(baseGrandTotal)}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium mt-1">
              <span>Đã duyệt trong dự toán</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="text-xs font-semibold text-slate-500">Ngân sách Kỳ vọng (P50)</div>
            <div className="text-xl font-black text-blue-600 mt-1">
              {formatVND(simulationResults.p50)}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-blue-600 font-medium mt-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>+{(((simulationResults.p50 - baseGrandTotal) / baseGrandTotal) * 100).toFixed(2)}% so với ban đầu</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/40 shadow-xs">
            <div className="text-xs font-semibold text-amber-800 flex items-center justify-between">
              <span>Ngưỡng An Toàn P80 (Chuẩn BXD)</span>
              <ShieldCheck className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-xl font-black text-amber-700 mt-1">
              {formatVND(simulationResults.p80)}
            </div>
            <div className="text-[11px] text-amber-800 font-medium mt-1">
              Dự phòng cần trích: <span className="font-bold">{formatVND(simulationResults.recommendedContingency)}</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-rose-200 bg-rose-50/40 shadow-xs">
            <div className="text-xs font-semibold text-rose-800 flex items-center justify-between">
              <span>Giá trị Rủi ro (VaR 95%)</span>
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-xl font-black text-rose-700 mt-1">
              +{formatVND(simulationResults.var95)}
            </div>
            <div className="text-[11px] text-rose-700 font-medium mt-1">
              Độ lệch tối đa mức tin cậy 95%
            </div>
          </div>
        </div>

        {/* 3. Main Workspace: Controls vs D3 Interactive Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Sliders & Simulation Parameters */}
          <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-600" />
                Tham số Đầu vào Kịch bản
              </div>
              <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-medium">
                {simulationRuns} Lần lặp
              </span>
            </div>

            {/* Slider 1: Steel */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">Biến động giá Thép & Kim khí:</span>
                <span className={`font-bold ${matSteelDelta > 0 ? 'text-rose-600' : 'text-slate-600'}`}>
                  {matSteelDelta > 0 ? `+${matSteelDelta}%` : `${matSteelDelta}%`}
                </span>
              </div>
              <input
                type="range"
                min="-10"
                max="50"
                step="1"
                value={matSteelDelta}
                onChange={e => setMatSteelDelta(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>-10%</span>
                <span>0%</span>
                <span>+25%</span>
                <span>+50%</span>
              </div>
            </div>

            {/* Slider 2: Concrete */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">Biến động Bê tông, Cát, Xi măng:</span>
                <span className={`font-bold ${matConcreteDelta > 0 ? 'text-rose-600' : 'text-slate-600'}`}>
                  {matConcreteDelta > 0 ? `+${matConcreteDelta}%` : `${matConcreteDelta}%`}
                </span>
              </div>
              <input
                type="range"
                min="-10"
                max="40"
                step="1"
                value={matConcreteDelta}
                onChange={e => setMatConcreteDelta(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>-10%</span>
                <span>0%</span>
                <span>+20%</span>
                <span>+40%</span>
              </div>
            </div>

            {/* Slider 3: Labor */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">Biến động đơn giá Nhân công:</span>
                <span className={`font-bold ${laborDelta > 0 ? 'text-amber-600' : 'text-slate-600'}`}>
                  {laborDelta > 0 ? `+${laborDelta}%` : `${laborDelta}%`}
                </span>
              </div>
              <input
                type="range"
                min="-5"
                max="35"
                step="1"
                value={laborDelta}
                onChange={e => setLaborDelta(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>-5%</span>
                <span>0%</span>
                <span>+15%</span>
                <span>+35%</span>
              </div>
            </div>

            {/* Slider 4: Machine */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">Biến động Ca máy & Nhiên liệu:</span>
                <span className={`font-bold ${machineDelta > 0 ? 'text-blue-600' : 'text-slate-600'}`}>
                  {machineDelta > 0 ? `+${machineDelta}%` : `${machineDelta}%`}
                </span>
              </div>
              <input
                type="range"
                min="-10"
                max="40"
                step="1"
                value={machineDelta}
                onChange={e => setMachineDelta(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            {/* Slider 5: Timeline Delay */}
            <div className="space-y-1.5 border-t border-slate-100 pt-3">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-purple-600" />
                  Kéo dài tiến độ thi công:
                </span>
                <span className="font-bold text-purple-600">
                  +{delayMonths} tháng
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="12"
                step="1"
                value={delayMonths}
                onChange={e => setDelayMonths(Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>

            {/* Slider 6: Annual Inflation */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">Tỷ lệ lạm phát kỳ vọng:</span>
                <span className="font-bold text-slate-700">
                  {inflationAnnual}%/năm
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="12"
                step="0.5"
                value={inflationAnnual}
                onChange={e => setInflationAnnual(Number(e.target.value))}
                className="w-full accent-slate-600 cursor-pointer"
              />
            </div>

            {/* Monte Carlo Run Counter */}
            <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
              <span className="text-xs text-slate-600">Số vòng lặp mô phỏng:</span>
              <div className="flex items-center gap-1">
                {[100, 500, 1000].map(cnt => (
                  <button
                    key={cnt}
                    onClick={() => setSimulationRuns(cnt)}
                    className={`px-2 py-0.5 text-[11px] font-semibold rounded ${
                      simulationRuns === cnt
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cnt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: D3 Visualizations */}
          <div className="lg:col-span-8 bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col">
            {/* D3 View Switcher */}
            <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3 gap-2">
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
                <button
                  onClick={() => setActiveD3Tab('distribution')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                    activeD3Tab === 'distribution'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Đường phân phối Monte Carlo (P50/P80/P90)
                </button>
                <button
                  onClick={() => setActiveD3Tab('scurve')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                    activeD3Tab === 'scurve'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Biểu đồ S-Curve Ngân sách theo thời gian
                </button>
                <button
                  onClick={() => setActiveD3Tab('sensitivity')}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                    activeD3Tab === 'sensitivity'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Độ nhạy rủi ro Tornado
                </button>
              </div>

              <div className="text-[11px] text-slate-400 font-medium">
                Vẽ bằng thư viện D3.js Vector
              </div>
            </div>

            {/* D3 Chart Canvas Area */}
            <div className="flex-1 min-h-[320px] flex items-center justify-center p-2 relative">
              {activeD3Tab === 'distribution' && (
                <div className="w-full flex flex-col items-center">
                  <svg ref={d3DistributionRef} viewBox="0 0 760 300" className="w-full h-auto max-h-[300px]" />
                  <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] mt-2 text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-0.5 bg-emerald-500 inline-block border-b-2 border-emerald-500 border-dashed" />
                      Ngân sách cơ sở: {formatVND(baseGrandTotal)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-0.5 bg-amber-500 inline-block border-b-2 border-amber-500" />
                      Ngưỡng an toàn P80: {formatVND(simulationResults.p80)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-0.5 bg-rose-500 inline-block border-b-2 border-rose-500 border-dotted" />
                      Ngưỡng cực hạn P90: {formatVND(simulationResults.p90)}
                    </span>
                  </div>
                </div>
              )}

              {activeD3Tab === 'scurve' && (
                <div className="w-full flex flex-col items-center">
                  <svg ref={d3SCurveRef} viewBox="0 0 760 300" className="w-full h-auto max-h-[300px]" />
                  <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] mt-2 text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-0.5 bg-emerald-500 inline-block border-b-2 border-emerald-500 border-dashed" />
                      Tiến độ cơ sở (12 tháng - {formatVND(baseGrandTotal)})
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-0.5 bg-rose-500 inline-block border-b-2 border-rose-500" />
                      Kịch bản biến động ({12 + delayMonths} tháng - {formatVND(simulationResults.mean)})
                    </span>
                  </div>
                </div>
              )}

              {activeD3Tab === 'sensitivity' && (
                <div className="w-full space-y-4 py-2">
                  <div className="text-xs font-semibold text-slate-600 mb-2">
                    Xếp hạng mức độ tác động khi từng yếu tố tăng 10% (Tornado Analysis):
                  </div>
                  {sensitivityRanking.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate-700 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                          {item.name}
                        </span>
                        <span className="font-mono font-bold text-slate-800">
                          +{formatVND(item.impactVND)} (+{item.elasticity.toFixed(2)}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(100, (item.impactVND / sensitivityRanking[0].impactVND) * 100)}%`,
                            backgroundColor: item.color
                          }}
                        />
                      </div>
                    </div>
                  ))}
                  <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-200 text-xs text-blue-900 mt-4 leading-relaxed">
                    <strong>Khuyến nghị của Kỹ sư trưởng Dự toán F1:</strong> Thép và vật liệu chiếm tỷ trọng lớn nhất trong chi phí trực tiếp ({((directMat / (directMat + directLab + directMac)) * 100).toFixed(1)}%). Nên ưu tiên áp dụng hợp đồng trọn gói hoặc thỏa thuận bảo lưu đơn giá với các nhà cung cấp thép lớn ngay khi ký kết hợp đồng thi công.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 4. Risk Register Table (Sổ tay kiểm soát rủi ro xây dựng) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Sổ Đăng Ký Kiểm Soát Rủi Ro & Biện Pháp Phòng Ngừa
            </h2>
            <span className="text-xs text-slate-500">Quy định tại Điều 12 Nghị định 10/2021/NĐ-CP</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <th className="p-3 w-12 text-center">STT</th>
                  <th className="p-3">Danh mục Rủi ro</th>
                  <th className="p-3">Phân loại</th>
                  <th className="p-3 text-center">Xác suất</th>
                  <th className="p-3 text-center">Mức ảnh hưởng</th>
                  <th className="p-3 text-right">Chi phí ước tính</th>
                  <th className="p-3">Biện pháp kiểm soát & Giảm thiểu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr className="hover:bg-slate-50">
                  <td className="p-3 text-center font-bold">1</td>
                  <td className="p-3 font-semibold text-slate-800">Biến động giá thép và kim khí vượt dự báo</td>
                  <td className="p-3 text-slate-500">Thị trường vật tư</td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 font-bold">Cao (75%)</span>
                  </td>
                  <td className="p-3 text-center font-bold text-rose-600">Rất lớn</td>
                  <td className="p-3 text-right font-mono font-bold text-rose-600">
                    +{formatVND(directMat * 0.45 * (matSteelDelta / 100))}
                  </td>
                  <td className="p-3 text-slate-600 leading-snug">
                    Áp dụng điều khoản trượt giá theo chỉ số giá XD của Sở Xây dựng ({settings.locationProvince}); Chốt đơn giá cố định theo lô hàng 3-6 tháng.
                  </td>
                </tr>

                <tr className="hover:bg-slate-50">
                  <td className="p-3 text-center font-bold">2</td>
                  <td className="p-3 font-semibold text-slate-800">Tăng lương tối thiểu vùng & thiếu thợ nề, cốp pha</td>
                  <td className="p-3 text-slate-500">Nhân lực thi công</td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700 font-bold">Trung bình (45%)</span>
                  </td>
                  <td className="p-3 text-center font-bold text-amber-600">Vừa phải</td>
                  <td className="p-3 text-right font-mono font-bold text-amber-600">
                    +{formatVND(directLab * (laborDelta / 100))}
                  </td>
                  <td className="p-3 text-slate-600 leading-snug">
                    Liên kết với các đội thợ chuyên nghiệp; Sử dụng ván khuôn định hình và cơ giới hóa thi công để giảm số công nhân.
                  </td>
                </tr>

                <tr className="hover:bg-slate-50">
                  <td className="p-3 text-center font-bold">3</td>
                  <td className="p-3 font-semibold text-slate-800">Chậm tiến độ mặt bằng & thời tiết mùa mưa</td>
                  <td className="p-3 text-slate-500">Tiến độ thi công</td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-bold">Vừa phải (50%)</span>
                  </td>
                  <td className="p-3 text-center font-bold text-blue-600">Trung bình</td>
                  <td className="p-3 text-right font-mono font-bold text-blue-600">
                    +{formatVND(baseGrandTotal * (delayMonths / 12) * (inflationAnnual / 100))}
                  </td>
                  <td className="p-3 text-slate-600 leading-snug">
                    Bố trí thi công cuốn chiếu 3 ca liên tục trong mùa khô; Tăng cường che phủ bạt và máy bơm thoát nước hố móng.
                  </td>
                </tr>

                <tr className="hover:bg-slate-50">
                  <td className="p-3 text-center font-bold">4</td>
                  <td className="p-3 font-semibold text-slate-800">Giá xăng dầu Diesel tăng cao ảnh hưởng máy đào, ép cọc</td>
                  <td className="p-3 text-slate-500">Nhiên liệu ca máy</td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-700 font-bold">Thấp (30%)</span>
                  </td>
                  <td className="p-3 text-center font-bold text-purple-600">Thấp</td>
                  <td className="p-3 text-right font-mono font-bold text-purple-600">
                    +{formatVND(directMac * (machineDelta / 100))}
                  </td>
                  <td className="p-3 text-slate-600 leading-snug">
                    Ký hợp đồng thuê trọn gói ca máy đã bao gồm nhiên liệu; Tối ưu hóa biểu đồ ca máy không để chạy không tải.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
