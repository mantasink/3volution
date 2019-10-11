import Chart from 'chart.js';

export class DnaChartContext {

    constructor(chartCtx, years, speeds, sizes, claws, shells) {
        this.years = years
        this.speeds = speeds
        this.sizes = sizes
        this.claws = claws
        this.shells = shells

        this.chart = new Chart(chartCtx, {
            type: 'line',
            data: {
                labels: this.years,
                datasets: [
                    {
                        label: 'Speed',
                        borderColor: 'orange',
                        fill: false,
                        data: this.speeds
                    },
                    {
                        label: 'Size',
                        borderColor: 'blue',
                        fill: false,
                        data: this.sizes,
                    },
                    {
                        label: 'Claws',
                        borderColor: 'red',
                        fill: false,
                        data: this.claws,
                    },
                    {
                        label: 'Shell',
                        borderColor: 'green',
                        fill: false,
                        data: this.shells,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });

    }

    update() {
        this.chart.update()
    }
}