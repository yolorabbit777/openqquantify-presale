import React, { useState, useEffect, useRef } from 'react'
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import highcharts3d from 'highcharts/highcharts-3d';

import './index.scss';

import { useViewport } from 'contexts/viewport/useViewport'

highcharts3d(Highcharts);

const symbolChartOptions = {
    title: {
        text: 'Cumulative Investments',
        style: { color: '#fff', fontSize: '15px' }
    },
    xAxis: {
        type: 'datetime',
        title: { text: '', style: { color: "#fff" } },
        labels: { enabled: false },
        lineWidth: 0,
        minorGridLineWidth: 0,
        lineColor: 'transparent',
        minorTickLength: 0,
        tickLength: 0
    },
    yAxis: {
        title: { text: '', style: { color: "#fff" } },
        labels: { enabled: false },
        gridLineColor: 'transparent',
    },
    tooltip: {
        crosshairs: true,
        shared: true,
        valuePrefix: '$'
    },
    plotOptions: {
        spline: {
            marker: {
                radius: 4,
                lineColor: '#666666',
                lineWidth: 1
            }
        }
    },
    exporting: {
        enabled: false
    },
    credits: {
        enabled: false
    },
    chart: {
        type: 'spline',
        backgroundColor: 'transparent',
        animation: false,
        plotBackgroundColor: "rgba(0,0,0,0)",
    },
    legend: {
        enabled: false
    }
} 

export const SymbolChart = ({ series, height }) => {
    const ref = useRef();
    const chartRef = useRef();
    const [chartOptions, setChartOptions] = useState(symbolChartOptions);
    const { width: windowWidth } = useViewport();

    const formatSeries = (series) => {
        return [{
            name: 'Investments',
            marker: {
                symbol: 'diamond',
                fillColor: 'white',
                lineWidth: 2,
                lineColor: Highcharts.getOptions().colors[0]
            },
            data: series,
        }];
    }

    useEffect(() => {
        if (chartRef?.current?.chart) {
            const chart = chartRef.current.chart;
            chart.setSize(ref.current.clientWidth, height);
            chart.redraw();
        }
    }, [windowWidth, chartRef?.current?.chart, ref?.current])

    useEffect(() => {
        if (!series) return;
        setChartOptions({ ...symbolChartOptions, series: formatSeries(series) });
    }, [series])

    useEffect(() => {
        if (ref.current && ref.current?.children[0]?.style) {
            ref.current.style.overflow = "";
            ref.current.children[0].style.overflow = "";
        }
    }, [chartOptions, ref]);

    return (
        <div ref = {ref} className='chart-container'>
            <HighchartsReact ref={chartRef} highcharts={Highcharts} options={chartOptions} allowChartUpdate={true}></HighchartsReact>
        </div>
    )
}