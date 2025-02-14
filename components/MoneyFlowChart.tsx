import React from 'react';
import { View, Dimensions } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

interface MoneyFlowChartProps {
  data: { date: string; value: number }[];
  color: string;
  width?: number;
  height?: number;
  padding?: number;
  smoothing?: number;
}

export function MoneyFlowChart({ data, color, width = 144, height = 55, padding = 5, smoothing = 0.4 }: MoneyFlowChartProps) {
  if (data.length === 0) return null;

  const values = data.map(d => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue || 1;

  const getY = (value: number) =>
    height - padding - ((value - minValue) / range) * (height - 2 * padding);

  const points = data.map((d, i) => ({
    x: (i / (data.length - 1)) * (width - 2 * padding) + padding,
    y: getY(d.value),
  }));

  const generatePath = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return '';
    let d = `M ${points[0].x},${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = i === 0 ? points[i] : points[i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = i + 2 < points.length ? points[i + 2] : p2;

      const cp1x = p1.x + (p2.x - p0.x) * smoothing;
      const cp1y = p1.y + (p2.y - p0.y) * smoothing;
      const cp2x = p2.x - (p3.x - p1.x) * smoothing;
      const cp2y = p2.y - (p3.y - p1.y) * smoothing;

      d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }

    return d;
  };

  const path = generatePath(points);

  const areaPath = `${path} L ${points[points.length - 1].x},${height - padding} L ${points[0].x},${height - padding} Z`;

  const gradientId = `gradient-${color.replace(/[^a-zA-Z0-9]/g, '')}`;

  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={color} stopOpacity="0.3" />
            <Stop offset="1" stopColor={color} stopOpacity="0.0" />
          </LinearGradient>
        </Defs>
        <Path d={areaPath} fill={`url(#${gradientId})`} />
        <Path d={path} stroke={color} strokeWidth="2" fill="none" />
      </Svg>
    </View>
  );
}
