import React, { useState, useEffect, useRef } from 'react'
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import highcharts3d from 'highcharts/highcharts-3d';

import './index.scss';

import { useViewport } from 'contexts/viewport/useViewport'

highcharts3d(Highcharts);

const pieChartOptions = {
    title: {
        text: ""
    },
    chart: {
        backgroundColor: 'transparent',
        type: 'pie',
        options3d: {
            enabled: true,
            alpha: 40,
        },
    },
    exporting: {
        enabled: false
    },

    credits: {
        enabled: false
    },
    plotOptions: {
        pie: {
            innerSize: '30%',
            depth: 20,
            dataLabels: {
                enabled: false,
            }
        }
    },
    legend: {
        enabled: false
    },
    colors: ['#ae7dff', '#14F195'],
}

export const PieChart = ({ series, height, className }) => {
    const ref = useRef();
    const chartRef = useRef();
    const [chartOptions, setChartOptions] = useState(pieChartOptions);
    const { width: windowWidth } = useViewport();

    useEffect(() => {
        if (chartRef?.current?.chart && ref?.current) {
            const chart = chartRef.current.chart;
            chart.setSize(ref.current.clientWidth, height);
            chart.redraw();
        }
    }, [windowWidth, chartRef?.current?.chart, ref?.current, height])

    useEffect(() => {
        if (!series) return;
        setChartOptions({ ...pieChartOptions, series: [{ name: 'Q', data: series }] });
    }, [series])

    useEffect(() => {
        if (ref.current && ref.current?.children[0]?.style) {
            ref.current.style.overflow = "";
            ref.current.children[0].style.overflow = "";
        }
    }, [chartOptions, ref]);

    return (
        <div ref={ref} className='chart-container'>
            <HighchartsReact ref={chartRef} highcharts={Highcharts} options={chartOptions} allowChartUpdate={true}></HighchartsReact>
        </div>
    )
}
