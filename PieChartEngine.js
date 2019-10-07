
// #region MetaData

// This function using to draw Pic Chart, and return object that contains object for each part of chart,
// you can use those objects to make your chart resposive.
// In the engine event on legendClick and part of slices of pie chart, 
// IF you want to override all functionality of event you can using this signature to create your function:   
//      function OnMouseLegendClicked(d, i){} => for event Clicked

// IF you want to increase some of your functionality for main functionality of each event you can using those signatures to create your functions:
//       function MouseLegendDown(d, i){} => for Legend event clicked this fired when clicked down only on each part of legend or Clicked down only on each part of pie chart
//       function MouseLegendUp(d, i){} => for Legend event clicked this fired when clicked Up only each part of legend or Clicked down only on each part of pie chart
//       You can use the above two methods to subscribe all event of legend event (DOWN/UP)

// It take an object that contains some of property that using to draw the chart:
// 1- divClassName: it is a mandatory you set class name of DIV which is want to draw the chart in it
// 2- SVG: it is an optional property, you can set it with exist SVG object ,if you draw exist chart and want to draw new chart above it
// 2- height: it is a mandatory, it set a height of main SVG
// 3- pieData: It is a mandatory , it must contains some of property as:
//      {Label: 'Label 01' ,ClassName: 'A A01' , Value: 22 },
//      {Label: 'Label 02' ,ClassName: 'B' , Value: 55 },
//      Lable => words/labels that describe and occures on your chart.
//      ClassName => set it with each part of data if you want to access it in any time.
//      Value => value that using ti draw chart.
// 4- colors: It is a mandatory, set it as array of colors that you want to using those to color slices
// 5- outerRadius: It is a mandatory, it is a radius of pie chart.
// 6- borderSlice: It is an optional, it is a border width between slices.
// 7- title: It is an optional, set title for chart
// 8- showLegend: It is an optional, set it true to show Legend
// 9- showLine: It is an optional, set it true to show out Lines and Labels
// 10-showLableOutside: It is an optional, set it true to show out Labels only.
// 11-showLabelInside: It is an optional, set it true to show inside Labels only.

// #endregion

function DrawPieChart({ divClassName, SVG, height, pieData, colors, outerRadius, borderSlice = 0, title, showLegend = false, showLine = false, showLableOutside = false, showLabelInside = false }) {
    let totalValues = 0;
    let innerRadius = 0;
    pieData.forEach(element => {
        totalValues += element.Value;
    });
    let resultPieData = {};

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
    resultPieData.SVG = svg;
    resultPieData.SVGWidth = svgWidth;
    // #endregion

    // #region inner && outer Radius && Pie Main Method
    let innerArc = d3.arc()     // innerArc for draw PieChart
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);
    let outerArc = d3.arc()     // this is a basic for draw pie chart lines
        .innerRadius(innerRadius)
        .outerRadius(outerRadius * 2);
    let outerArcForTextInside = d3.arc()     // this is a basic for draw pie chart lines
        .innerRadius(innerRadius)
        .outerRadius(outerRadius * 1.5);
    let outerArcPolyline = d3.arc() // this is a end for draw pie chart lines
        .innerRadius(innerRadius)
        .outerRadius(outerRadius * 2.1);
    let outerArcTexte = d3.arc() // this is for draw pie chart labels
        .innerRadius(innerRadius)
        .outerRadius(outerRadius * 2.3);

    let pie = d3.pie()
        .value((d) => d.Value);
    // #endregion

    // #region Draw Legend
    let LegendLineNumber = 0;

    if (showLegend) {
        let gLegend;
        if (title != undefined) {
            gLegend = svg.append('g')
                .attr('class', 'Legend')
                .attr('transform', 'translate(' + (height - 100) + ',40)');
        } else {
            gLegend = svg.append('g')
                .attr('class', 'Legend')
                .attr('transform', 'translate(' + (height - 100) + ',20)');
        }
        let gLegendColor = gLegend.append('g')
            .attr('class', 'LegendColor')

        let cy = 0;
        let cyCount = 0;
        let cxCount = 0;
        let positionLegend = 0;
        let maxLenght = 0;
        let dataLenght = [];
        pieData.forEach(item => {
            dataLenght.push(item.Label.length);
        })
        let count = svgWidth / (Math.max(...dataLenght) * 15);
        gLegendColor.selectAll('.circle')
            .data(pieData)
            .enter()
            .append('circle')
            .attr('class', (d) => d.Label + " legendColor " + d.Label + 'Legend')
            .attr('cx', ((d, i) => {
                if (cxCount == count.toFixed(0) - 1) {
                    cxCount = 0;
                }
                return cxCount++ * 120;
            }))
            .attr('cy', (d, i) => {
                if (cyCount == count.toFixed(0) - 1) {
                    svg.attr('height', parseInt(svg.style("height").substring(0, svg.style("height").length - 2)) + cyCount)
                    height = parseInt(svg.style("height").substring(0, svg.style("height").length - 2));
                    cyCount = 0;
                    cy += 30;
                    LegendLineNumber += 1;
                }
                cyCount++;
                return cy;
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
            .data(pieData)
            .enter()
            .append('text')
            .attr('class', (d) => d.Label + " legendText")
            .text((d) => d.Label)
            .attr('x', ((d, i) => {
                if (cxCount == count.toFixed(0) - 1) {
                    cxCount = 0;
                }
                return (cxCount++ * 120) + 7;
            })).attr('y', (d, i) => {
                if (cyCount == count.toFixed(0) - 1) {
                    cyCount = 0;
                    cy += 30;
                }
                cyCount++;
                return cy + 4;
            })
            .attr('font-size', '12')
            .on('mousedown', OnMouseLegendClicked)

        resultPieData.Legend = gLegend;
        resultPieData.LegendColor = gLegendColor;
        resultPieData.LegendText = gLegendText;
    }

    // #endregion

    // #region Draw Pie Chart
    let gPieChart = svg.append('g')
        .attr('class', 'PieChartIterations')
        .attr('transform', 'translate(50,0)')
    gPieChart.selectAll('pie')
        .data(pie(pieData))
        .enter()
        .append('path')
        .attr('class', (d) => d.data.Label + ' pieChart ' + (d.ClassName != undefined ? d.ClassName : ''))
        .attr('d', innerArc)
        .attr('transform', 'translate(' + ((svgWidth / 2) - 40) + ',' + (((height - 100) / 2) + (LegendLineNumber * 15)) + ')')
        .attr('fill', (d, i) => color(i + 1))
        .attr('stroke', 'white')
        .attr('stroke-width', borderSlice)
        .on('mousedown', OnMouseLegendClicked)

    resultPieData.PieChart = gPieChart;
    // #endregion

    // #region Draw Pie Label 
    let gPieLabel;
    if (showLine) {
        gPieLabel = svg.append('g')
            .attr('class', 'PieText')
            .attr('transform', 'translate(' + ((svgWidth / 2)) + ',' + (((height - 200) / 1.6) + (LegendLineNumber * 10)) + ')')
        gPieLabel.selectAll('.txt')
            .data(pie(pieData))
            .enter()
            .append("text")
            .text((d) => d.data.Label + ' ' + d.data.Value)
            .attr('x', (d) => {
                let pos = outerArcTexte.centroid(d);
                let midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
                pos[0] = (outerRadius * 1.3) * (midangle < Math.PI ? 1 : -1);
                return pos[0] - (d.data.Label + ' ' + d.data.Value).length - 10;
            })
            .attr('y', (d) => outerArcTexte.centroid(d)[1])
            .attr('font-size', '12')

        resultPieData.PieLabel = gPieLabel;
    }
    else if (!showLine && showLableOutside) {
        gPieLabel = svg.append('g')
            .attr('class', 'PieText')
            .attr('transform', 'translate(' + ((svgWidth / 2)) + ',' + (((height - 200) / 1.6) + (LegendLineNumber * 10)) + ')')
        gPieLabel.selectAll('.txt')
            .data(pie(pieData))
            .enter()
            .append("text")
            .text((d) => d.data.Label + ' ' + d.data.Value)
            .attr('x', (d) => outerArcTexte.centroid(d)[0] - 15)
            .attr('y', (d) => outerArcTexte.centroid(d)[1])
            .attr('font-size', '12')

        resultPieData.PieLabel = gPieLabel;
    }
    if (showLabelInside) {
        gPieLabel = svg.append('g')
            .attr('class', 'PieText')
            .attr('transform', 'translate(' + ((svgWidth / 2)) + ',' + (((height - 200) / 1.6) + (LegendLineNumber * 10)) + ')')
        gPieLabel.selectAll('.txt')
            .data(pie(pieData))
            .enter()
            .append("text")
            .text((d) => ((d.data.Value / totalValues) * 100).toFixed(2) + ' %')
            .attr('x', (d) => (innerArc.centroid(d)[0] - 5) * 1.5)
            .attr('y', (d) => innerArc.centroid(d)[1] * 1.6)
            .attr('font-size', '12')
            .attr('fill', 'white')

        resultPieData.PieLabel = gPieLabel;
    }
    // #endregion

    // #region Draw Pie Line
    if (showLine) {
        let gPieLine = svg.append('g')
            .attr('class', 'PieLines')
            .attr('transform', 'translate(50,0)')
        gPieLine.selectAll('.line')
            .data(pie(pieData))
            .enter()
            .append("polyline")
            .attr('transform', 'translate(' + ((svgWidth / 2) - 40) + ',' + (((height - 100) / 2) + (LegendLineNumber * 15)) + ')')
            .attr("points", function (d) {
                var posA = outerArc.centroid(d);
                var posB = outerArcPolyline.centroid(d);
                let posC = outerArcTexte.centroid(d);
                let midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
                posC[0] = (outerRadius * 1.1) * (midangle < Math.PI ? 1 : -1);
                return [posA, posB, posC]
            })
            .attr('stroke', (d, i) => color(i + 1))
            .attr("fill", "none");

        resultPieData.PieLine = gPieLine;
    }
    // #endregion

    // #region title
    if (title != undefined) {
        let gtitle = svg.append('g')
            .attr('transform', 'translate(' + (svgWidth / 2) + ' , 25)')
            .attr('class', 'gtitle')
            .append('text')
            .text(title);

        resultPieData.gtitle = gtitle;
    }
    // #endregion

    return resultPieData;
}

// #region Event Methods 
let flagPieLegend = -1;
function OnMouseLegendClicked(d, i) {
    if (flagPieLegend != i) {
        d3.selectAll('.legendColor')
            .attr('opacity', '0.3')
        d3.selectAll('.pieChart')
            .attr('opacity', '0.3')

        if (d.Label != undefined) {
            d3.selectAll('.' + d.Label)
                .attr('opacity', '1')
        }
        else if (d.data.Label != undefined) {
            d3.selectAll('.' + d.data.Label)
                .attr('opacity', '1')
        }

        MouseLegendDown(d, i);
        flagPieLegend = i;
    } else {
        d3.selectAll('.legendColor')
            .attr('opacity', '1')
        d3.selectAll('.pieChart')
            .attr('opacity', '1')

        MouseLegendUp(d, i);
        flagPieLegend = -1;
    }

}

function MouseLegendDown(d, i) { }
function MouseLegendUp(d, i) { }
// #endregion

