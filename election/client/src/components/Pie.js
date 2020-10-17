import React, { Component } from "react";
import "../App.css";
import ChartistGraph from 'react-chartist';

class Pie extends Component {
    render() {
        const { data, labels } = this.props;
        // console.log(data);
        // console.log(labels);

        let sum = function(a, b) { return a + b };

        let options = {
            width:  '500px',
            height:  '500px',
            responsive: true,
            maintainAspectRatio: false,
            labelDirection: 'explode',
            labelInterpolationFnc: function(value) {
                let percentage = Math.round(value / data.series.reduce(sum) * 100) + '%';
                return percentage;
            }
        };

        let responsiveOptions = [
            ['screen and (min-width: 640px)', {
                maintainAspectRatio: false,
                labelOffset: 100,
                chartPadding: 130,
                labelDirection: 'explode',
                labelInterpolationFnc: function(value) {
                    let percentage = Math.round(value / data.series.reduce(sum) * 100) + '%';
                    return percentage;
                }
            }],
            ['screen and (min-width: 1024px)', {
                maintainAspectRatio: false,
                labelOffset: 100,
                chartPadding: 130,
                labelDirection: 'explode',
                labelInterpolationFnc: function(value, idx) {
                    let percentage = Math.round(value / data.series.reduce(sum) * 100) + '%';
                    return labels[idx] + ' ' + percentage;
                }
            }]
        ];
        const type = 'Pie';

        return (
            <div className="Pie">
                <ChartistGraph data={data} options={options} responsiveOptions={responsiveOptions} type={type} />
            </div>
        );
    }
}

export default Pie;