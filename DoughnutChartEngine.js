
// #region MetaData 

// This function using to draw Doughnut Chart, and return object that contains object for each slice of chart,
// you can use those objects to make your chart resposive.
// In the engine event on legendClick and slice of slices of Doughnut chart, 
// IF you want to override all functionality of event you can using this signature to create your function:   
//      function OnMouseLegendClicked(d, i){} => for event Clicked

// IF you want to increase some of your functionality for main functionality of each event you can using those signature to create your functions:
//       function MouseLegendDown(d, i){} => for Legend event clicked this fired when clicked down only on each part of legend or Clicked down only on each slice of Doughnut chart
//       function MouseLegendUp(d, i){} => for Legend event clicked this fired when clicked Up only each part of legend or Clicked down only on each slice of Doughnut chart
//       You can use the above two methods to subscribe all event of legend event (DOWN/UP)

// It take an object that contains some of property that using to draw the chart:
// 1- divClassName: it is a mandatory you set class name of DIV which is want to draw the chart in it
// 2- SVG: it is an optional property, you can set it with exist SVG object ,if you draw exist chart and want to draw new chart above it
// 2- height: it is a mandatory, it set a height of main SVG
// 3- DoughnutData: It is a mandatory , it must contains some of property as:
//      {Label: 'Label 01' ,ClassName: 'A A01' , Value: 22 },
//      {Label: 'Label 02' ,ClassName: 'B' , Value: 55 },
//      Lable => words/labels that describe and occures on your chart.
//      ClassName => set it with each part of data if you want to access it in any time.
//      Value => value that using ti draw chart.
// 4- colors: It is a mandatory, set it as array of colors that you want to using those to color slices
// 5- outerRadius: It is a mandatory, it is a radius of Doughnut chart.
// 6- borderSlice: It is an optional, it is a border width between slices.
// 7- showLegend: It is an optional, set it true to show Legend
// 8- title: It is an optional, set title for chart
// 9- showLine: It is an optional, set it true to show out Lines and Labels
// 10-showLableOutside: It is an optional, set it true to show out Labels only.
// 11-showLabelInside: It is an optional, set it true to show inside Labels only.

// #endregion

function DrawDoughnutChart({ divClassName, SVG, height, DoughnutData, colors, innerRadius, outerRadius, borderSlice = 0, title, showLegend = false, showLine = false, showLableOutside = false, showLabelInside = false }) {
    let totalValues = 0;
    DoughnutData.forEach(element => {
        totalValues += element.Value;
    });
    let resultDoughnutData = {};

    // #region Draw MAin SVG
    let svg;
    if (SVG == undefined) {
        svg = d3.select('.' + divClassName)
            .append('svg')
            .attr('class', divClassName)
            .attr('height', height);
    } else {
        svg = SVG;
    }
    let svgWidth = parseInt(svg.style("width").substring(0, svg.style("width").length - 2));
    let color = d3.scaleOrdinal(colors);
    resultDoughnutData.SVG = svg;
    resultDoughnutData.SVGWidth = svgWidth;
    // #endregion

    // #region inner && outer Radius && Doughnut Main Method
    let innerArc = d3.arc()     // innerArc for draw DoughnutChart
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);
    let outerArc = d3.arc()     // this is a basic for draw Doughnut chart lines
        .innerRadius(innerRadius)
        .outerRadius(outerRadius * 1.4);
    let outerArcForTextOutside = d3.arc()     // this is a basic for draw Doughnut chart lines
        .innerRadius(innerRadius)
        .outerRadius(outerRadius * 2.2);
    let outerArcPolyline = d3.arc() // this is a end for draw Doughnut chart lines
        .innerRadius(innerRadius)
        .outerRadius(outerRadius * 1.8);
    let outerArcTexte = d3.arc() // this is for draw Doughnut chart labels
        .innerRadius(innerRadius)
        .outerRadius(outerRadius * 1.8);

    let pie = d3.pie()
        .value((d) => d.Value);
    // #endregion

    // #region Draw Doughnut Chart
    let gDoughnutChart = svg.append('g')
        .attr('class', 'gDoughnutChart')
        .attr('transform', 'translate(0,0)')
    gDoughnutChart.selectAll('Doughnut')
        .data(pie(DoughnutData))
        .enter()
        .append('path')
        .attr('class', (d) => d.data.Label.replace(/\s/g, '') + 'Dount DoughnutChart ' + (d.ClassName != undefined ? d.ClassName : ''))
        .attr('d', innerArc)
        .attr('transform', 'translate(' + ((svgWidth / 2) - 0) + ',' + ((height / 2) - 10) + ')')
        .attr('fill', (d, i) => color(i + 1))
        .attr('stroke', 'white')
        .attr('stroke-width', borderSlice)
        .on('mousedown', OnMouseLegendClicked)

    resultDoughnutData.DoughnutChart = gDoughnutChart;
    // #endregion

    // #region Draw Legend

    if (showLegend) {
        let gLegend = svg.append('g')
            .attr('class', 'Legend')
            .attr('transform', 'translate(' + (10) + ',' + (height - 70) + ')');
        let gLegendColor = gLegend.append('g')
            .attr('class', 'LegendColor')

        let cy = 0;
        let cyCount = 0;
        let cxCount = 0;
        let dataLenght = [];
        DoughnutData.forEach(item => {
            dataLenght.push(item.Label.length);
        })
        gLegendColor.selectAll('.circle')
            .data(DoughnutData)
            .enter()
            .append('circle')
            .attr('class', (d) => d.Label + " legendColor " + d.Label.replace(/\s/g, '') + 'Legend')
            .attr('cx', ((d, i) => {
                if ((cxCount * 110) >= (svgWidth - 100)) {
                    cxCount = 0;
                }
                return (cxCount++ * 110)
            }))
            .attr('cy', (d, i) => {
                if ((cyCount * 110) >= (svgWidth - 100)) {
                    cyCount = 0;
                    cy += 20;
                }
                cyCount++;
                return cy - 5;
            })
            .attr('r', '6')
            .attr('fill', (d, i) => color(i + 1))
            .on('mousedown', OnMouseLegendClicked)

        cy = 0;
        cyCount = 0;
        cxCount = 0;
        let gLegendText = gLegend.append('g')
            .attr('class', 'LegendText')
        gLegendText.selectAll('.txt')
            .data(DoughnutData)
            .enter()
            .append('text')
            .attr('class', (d) => d.Label.replace(/\s/g, '') + " legendText")
            .text((d) => d.Label)
            .attr('x', ((d, i) => {
                if ((cxCount * 110) >= (svgWidth - 100)) {
                    cxCount = 0;
                    d3.selectAll('.pieChart')
                        .attr('height', (parseInt(svg.style("height").substring(0, svg.style("height").length - 2)) + 10))
                }
                return (cxCount++ * 110) + 7
            })).attr('y', (d, i) => {
                if ((cyCount * 110) >= (svgWidth - 100)) {
                    cyCount = 0;
                    cy += 20;
                }
                cyCount++;
                return cy;
            })
            .attr('font-size', '12')
            .on('mousedown', OnMouseLegendClicked)

        resultDoughnutData.Legend = gLegend;
        resultDoughnutData.LegendColor = gLegendColor;
        resultDoughnutData.LegendText = gLegendText;

        // d3.selectAll('.Legend')
        //     .attr('transform', 'translate(' + ((svgWidth / 2) - 240) + ',' + (height - (LegendLineNumber * 30)) + ')');

    }

    // #endregion

    // #region Draw Doughnut Label 
    let gDoughnutLabel;
    if (showLine) {
        gDoughnutLabel = svg.append('g')
            .attr('class', 'DoughnutText')
            .attr('transform', 'translate(' + ((svgWidth / 2) - 10) + ',' + (((height - 20) / 1.9) - 5) + ')')
        gDoughnutLabel.selectAll('.txt')
            .data(pie(DoughnutData))
            .enter()
            .append("text")
            .text((d) => d.data.Label + ' ' + d.data.Value.toFixed(2))
            .attr('x', (d) => {
                let pos = outerArcTexte.centroid(d);
                let midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
                pos[0] = (outerRadius * 1.5) * (midangle < Math.PI ? 1 : -1);
                return pos[0] - (d.data.Label + ' ' + d.data.Value).length - 10;
            })
            .attr('y', (d) => outerArcTexte.centroid(d)[1])
            .attr('font-size', '10')

        resultDoughnutData.DoughnutLabel = gDoughnutLabel;
    }
    else if (!showLine && showLableOutside) {
        gDoughnutLabel = svg.append('g')
            .attr('class', 'DoughnutText')
            .attr('transform', 'translate(' + ((svgWidth / 2) - 20) + ',' + (((height - 20) / 1.9) - 5) + ')')
        gDoughnutLabel.selectAll('.txt')
            .data(pie(DoughnutData))
            .enter()
            .append("text")
            .text((d) => d.data.Label + ' ' + d.data.Value.toFixed(2))
            .attr('x', (d) => outerArcForTextOutside.centroid(d)[0] * 1.1 - 15)
            .attr('y', (d) => outerArcForTextOutside.centroid(d)[1] * 0.9)
            .attr('font-size', '12')

        resultDoughnutData.DoughnutLabel = gDoughnutLabel;
    }
    if (showLabelInside) {
        gDoughnutLabel = svg.append('g')
            .attr('class', 'DoughnutText')
            .attr('transform', 'translate(' + ((svgWidth / 2) - 10) + ',' + (((height - 20) / 1.9) - 5) + ')')
        gDoughnutLabel.selectAll('.txt')
            .data(pie(DoughnutData))
            .enter()
            .append("text")
            .text((d) => ((d.data.Value / totalValues) * 100).toFixed(2) + ' %')
            .attr('x', (d) => (innerArc.centroid(d)[0] - 5))
            .attr('y', (d) => innerArc.centroid(d)[1])
            .attr('font-size', '10')
            .attr('fill', 'white')
            .on('mousedown', OnMouseLegendClicked)


        resultDoughnutData.DoughnutLabel = gDoughnutLabel;
    }
    // #endregion

    // #region Draw Doughnut Line
    if (showLine) {
        let gDoughnutLine = svg.append('g')
            .attr('class', 'DoughnutLines')
            .attr('transform', 'translate(0,10)')
        gDoughnutLine.selectAll('.line')
            .data(pie(DoughnutData))
            .enter()
            .append("polyline")
            .attr('transform', 'translate(' + ((svgWidth / 2) - 0) + ',' + (((height - 20) / 2) - 10) + ')')
            .attr("points", function (d) {
                var posA = outerArc.centroid(d);
                var posB = outerArcPolyline.centroid(d);
                let posC = outerArcTexte.centroid(d);
                let midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
                posC[0] = (outerRadius * 1.15) * (midangle < Math.PI ? 1 : -1);
                return [posA, posB, posC]
            })
            .attr('stroke', (d, i) => color(i + 1))
            .attr("fill", "none");

        resultDoughnutData.DoughnutLine = gDoughnutLine;
    }
    // #endregion

    // #region title
    if (title != undefined) {
        let gtitle = svg.append('g')
            .attr('transform', 'translate(' + ((svgWidth / 2) - 50) + ' , 25)')
            .attr('class', 'gtitle')
            .append('text')
            .text(title);

        resultDoughnutData.gtitle = gtitle;
    }
    // #endregion

    return resultDoughnutData;
}

// #region Event Methods 
let flagDoughnutLegend = -1;
function OnMouseLegendClicked(d, i) {
    if (flagDoughnutLegend != i) {

        d3.selectAll('.legendColor')
            .attr('opacity', '0.3')
        d3.selectAll('.DoughnutChart')
            .attr('opacity', '0.3')
        if (d.Label != undefined) {
            d3.selectAll('.' + d.Label.replace(/\s/g, '') + 'Dount')
                .attr('opacity', '1')
            d3.selectAll('.' + d.Label.replace(/\s/g, '') + 'Legend')
                .attr('opacity', '1')
        }
        else if (d.data.Label != undefined) {
            d3.selectAll('.' + d.data.Label.replace(/\s/g, '') + 'Dount')
                .attr('opacity', '1')
            d3.selectAll('.' + d.data.Label.replace(/\s/g, '') + 'Legend')
                .attr('opacity', '1')
        }

        MouseLegendDown(d, i);
        flagDoughnutLegend = i;
    } else {
        d3.selectAll('.legendColor')
            .attr('opacity', '1')
        d3.selectAll('.DoughnutChart')
            .attr('opacity', '1')

        MouseLegendUp(d, i);
        flagDoughnutLegend = -1;
    }

}

function MouseLegendDown(d, i) { }
function MouseLegendUp(d, i) { }
// #endregion