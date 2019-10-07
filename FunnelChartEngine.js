
// #region MetaData
// This function using to draw Funnel Chart, and return object that contains object for each part of chart,
// you can use those objects to make your chart resposive.
// In the engine event on legendClick and part of slices based on yScale labels Clicked, 
// IF you want to override all functionality of event you can using those signatures to create your functions:   
//      function OnMouseLegendClick(d, i){} => for lengend event Clicked
//      function OnMouseFunnelChartClicked(d, i){} => for each part of slices based on yScale labels Clicked

// IF you want to increase some of your functionality for main functionality of each event you can using those signatures to create your functions:
//       function CLickDownLegend(d, i){} => for Legend event clicked this fired when clicked down only on each part of legend
//       function ClickUpLegend(d, i){} => for Legend event clicked this fired when clicked Up only on each part of legend
//       You can use the above two methods to subscribe all event of legend event (DOWN/UP)
//       function ClickDownFunnelChartClicked(d, i){} => for partOFFunnelChart based on YScale labels, event clicked this fired when clicked down only on each part of legend
//       function ClickUpFunnelChartClicked(d, i){} => for partOFFunnelChart based on YScale labels, event clicked this fired when clicked down only on each part of legend

// It take an object that contains some of property that using to draw the chart:
// 1- divClassName: it is a mandatory you set class name of DIV which is want to draw the chart in it
// 2- height: it is a mandatory, it set a height of main SVG
// 3- SVG: it is an optional property, you can set it with exist SVG object ,if you draw exist chart and want to draw new chart above it
// 4- dataSet: It is a mandatory , it must contains some of property as:
//      {ValueY: 'Label 01' ,ClassName: 'A A01' , Value: 22},
//      {ValueY: 'Label 01' ,ClassName:'B', Value: 25}    
//      ValueY => Items that occurs in yScale
//      Value  => Its are Value of Slices , each Value act as Slice.
//      ClassName => If you want to add class name for each slice
// 5- title: It is an optional, you can set Title for Chart
// 6- colors: It is a mandatory, set it as array of colors that you want to using those to color slices
// 7- dataLegend: It is an optional , you can set it if you want to show Legned, but you must set array of names in order as order of slices as
//      ['valueItem1' , 'valueItem2' , ...] each value here must be name that you want to  occure in legend and much each slice
// 8- xScaleTitle: It is an optional, you can set it with string value if you want to occure title for XScale
// 9- yScaleTitle: It is an optional, you can set it with string value if you want to occure title for YScale
// 10- ShowLabels: It is an optional , you can set it with TRUE if you want to show values of each slice with it.
// 11- ShowXScale: It is an optional , you can set it with TRUE if you want to show XLine.
// 12- ShowYScale: It is an optional , you can set it with TRUE if you want to show YLine.
// 13- HiddenYTips: It is an optional, you can set it if you want to hidden the lines of YScale
// 14- HiddenXTips: It is an optional, you can set it if you want to hidden the lines of XScale

// #endregion

function DrawHorizontalFunnelChart({ divClassName, height, SVG,  dataSet, title, colors, dataLegend, xScaleTitle, yScaleTitle, ShowLabels = false, ShowXScale = false, ShowYScale = false, HiddenYTips = false, HiddenXTips = false }) {
    let result = {};

    // #region MAin SVG
    let color = d3.scaleOrdinal(colors);
    let svgWidth;
    let svgFunnel;
    if (SVG == undefined) {
        svgFunnel = d3.select("." + divClassName)
            .append("svg")
            .attr('class', 'svgFunnel')
            .attr("height", height)
    } else {
        svgFunnel = SVG;
    }
    svgWidth = parseInt(svgFunnel.style("width").substring(0, svgFunnel.style("width").length - 2));
    result.SVG = svgFunnel;
    result.SvgWidth = svgWidth;
    // #endregion

    // #region XScale && YScale
    let xScale = d3.scaleLinear()
        .domain([0, d3.max(dataSet, (d) => d.Value)])
        .range([0, svgWidth - 150]);
    if (ShowXScale) {
        let gXScale = svgFunnel.append("g")
            .attr('class', "xScale")
            .attr("transform", 'translate(100 , ' + (height - 30) + ')')
            .call(d3.axisBottom(xScale));
        result.gXScale = gXScale;
    }
    if (xScaleTitle != undefined) {
        let gXScaleTitle = svgFunnel.append("g")
            .attr('class', "xScaleTitle")
            .attr("transform", 'translate(' + (svgWidth / 2) + ' , ' + (height - 10) + ')')
            .append('text')
            .text(xScaleTitle);
        result.xScaleTitle = gXScaleTitle;
    }

    let yScale = d3.scaleLinear()
        .domain([d3.min(dataSet, (d) => d.ValueY), d3.max(dataSet, (d) => d.ValueY)])
        .range([30, height - 100])
    if (ShowYScale) {
        let gYScale = svgFunnel.append("g")
            .attr('class', "yScale")
            .attr("transform", 'translate(100 , ' + 70 + ')')
            .call(d3.axisLeft(yScale));
        result.gYScale = gYScale;
    }

    if (yScaleTitle != undefined) {
        let gYScaleTitle = svgFunnel.append("g")
            .attr('class', "yScaleTitle")
            .attr("transform", 'translate(20 , ' + (height / 2) + ')')
            .append('text')
            .text(yScaleTitle)
            .attr('transform', 'rotate(-90)');
        result.yScaleTitle = gYScaleTitle;
    }
    // #endregion

    // #region Title
    if (title != undefined) {
        let gFunnelTitle = svgFunnel.append('text')
            .attr('class', 'gFunnelTitle')
            .attr("transform", 'translate(' + ((svgWidth / 2) + 50) + ' , ' + 30 + ')')
            .text(title)
            .attr('font-size', '12')
            .attr('font-weight', 'bold');
        result.gFunnelTitle = gFunnelTitle;
    }
    // #endregion

    // #region Draw Funnel Chart
    let gFunnelChart = svgFunnel.append("g")
        .attr('class', 'gFunnelChart')
        .attr("transform", 'translate(30 , ' + (70) + ')');
    gFunnelChart.selectAll('.g')
        .data(dataSet)
        .enter()
        .append('rect')
        .attr("class", (d, i) => (dataLegend != undefined ? dataLegend[i] : '') + ' FunnelChart ' + 'FunnelSlice' + d.Value + (d.ClassName != undefined ? d.ClassName : ''))
        .attr("x", d => svgWidth / 2 - xScale(d.Value) / 2)
        .attr("y", (d) => yScale(d.ValueY) - ((height / (yScale.ticks().length) - 20) / 2))
        .attr("width", (d) => xScale(d.Value) - 20)
        .attr("height", (height / (yScale.ticks().length) - 20))
        .attr('fill', (d, i) => color(i))
        .on('mousedown', OnMouseFunnelChartClicked)


    if (ShowLabels) {
        let gFunnelChartLabel = svgFunnel.append("g")
            .attr('class', 'gFunnelChartLabel')
            .attr("transform", 'translate(80 , ' + (70) + ')');
        gFunnelChartLabel.selectAll('.Label')
            .data(dataSet)
            .enter()
            .append('text')
            .attr("class", d => ' label')
            .text((d) => d.Value)
            .attr("x", (d) => svgWidth / 2 - xScale(d.Value) / 2 + xScale(d.Value) - 65)
            .attr("y", (d) => yScale(d.ValueY) - ((yScale.ticks().length) - 20) / 4)
            .attr('font-size', '12')
            .on('mousedown', OnMouseFunnelChartClicked)


        result['gFunnelChartItem'] = gFunnelChart;
    }
    // #endregion

    // #region Draw Legend
    if (dataLegend != undefined) {
        let cy = 0;
        let cyCount = 0;
        let cxCount = 0;

        let gLegendFunnelText = svgFunnel.append('g')
            .attr('class', 'gLegendFunnelText')
            .attr("transform", 'translate(' + 106 + ' , ' + (height + 20) + ')');
        gLegendFunnelText.selectAll('.txt')
            .data(dataLegend)
            .enter()
            .append('text')
            .text((d) => d)
            .attr('class', (d) => d + ' legendText')
            .attr('x', ((d, i) => {
                if ((cxCount * 110) >= (svgWidth - 150)) {
                    cxCount = 0;
                }
                return (cxCount++ * 110)
            }))
            .attr('y', (d, i) => {
                if ((cyCount * 110) >= (svgWidth - 150)) {
                    cyCount = 0;
                    cy += 20;
                }
                cyCount++;
                return cy - 5;
            })
            .attr('font-size', '12')
            .on('mousedown', OnMouseLegendClick);

        cy = 0;
        cyCount = 0;
        cxCount = 0;
        let gLegendFunnelColor = svgFunnel.append('g')
            .attr('class', 'gLegendFunnelColor')
            .attr("transform", 'translate(100 , ' + (height + 20) + ')');
        gLegendFunnelColor.selectAll('.txt')
            .data(dataLegend)
            .enter()
            .append('circle')
            .attr('class', (d) => 'Legend' + d + ' Legend')
            .attr('cx', ((d, i) => {
                if ((cxCount * 110) >= (svgWidth - 150)) {
                    cxCount = 0;
                    d3.selectAll('.svgFunnel')
                        .attr('height', (parseInt(svgFunnel.style("height").substring(0, svgFunnel.style("height").length - 2)) + 50))
                }
                return (cxCount++ * 110)
            })).attr('cy', (d, i) => {
                if ((cyCount * 110) >= (svgWidth - 150)) {
                    cyCount = 0;
                    cy += 20;
                }
                cyCount++;
                return cy - 8;
            })
            .attr('r', '6')
            .attr('fill', (d, i) => color(i))
            .on('mousedown', OnMouseLegendClick);

        result.gLegendFunnelText = gLegendFunnelText;
        result.gLegendFunnelColor = gLegendFunnelColor;
    }
    // #endregion

    // #region Show/Hidden Y/X Tips
    if (HiddenYTips) {
        d3.selectAll('.yScale .domain')
            .attr('opacity', '0')
        d3.selectAll('.yScale line')
            .attr('opacity', '0')
    }
    if (HiddenXTips) {
        d3.selectAll('.xScale .domain')
            .attr('opacity', '0')
        d3.selectAll('.xScale line')
            .attr('opacity', '0')
    }
    // #endregion

    return result;
}

// #region Event Methods 

let flagFunnel = -1;
function OnMouseFunnelChartClicked(d, i) {
    if (flagFunnel != i) {
        d3.selectAll('.FunnelChart')
            .attr('opacity', '0.3');
        d3.selectAll('.FunnelSlice' + d.Value)
            .attr('opacity', '1');

        d3.selectAll('.Legend')
            .attr('opacity', '0.3');
        d3.selectAll('.Legend' + d.Value)
            .attr('opacity', '1');

        ClickDownFunnelChartClicked(d, i);
        flagFunnel = i;
    } else {
        d3.selectAll('.FunnelChart')
            .attr('opacity', '1');
        d3.selectAll('.Legend')
            .attr('opacity', '1');

        ClickUpFunnelChartClicked(d, i);
        flagFunnel = -1;
    }
}

function ClickDownFunnelChartClicked(d, i) { }
function ClickUpFunnelChartClicked(d, i) { }

let flagFunnelLegend = -1;
function OnMouseLegendClick(d, i) {
    if (flagFunnelLegend != i) {
        d3.selectAll('.Legend')
            .attr('opacity', '0.3');
        d3.selectAll('.FunnelChart')
            .attr('opacity', '0.3');
        d3.selectAll('.FunnelSlice' + d)
            .attr('opacity', '1');
        d3.selectAll('.Legend' + d)
            .attr('opacity', '1');

        ClickDownLegend(d, i);
        flagFunnelLegend = i;
    } else {
        d3.selectAll('.Legend')
            .attr('opacity', '1');
        d3.selectAll('.FunnelChart')
            .attr('opacity', '1');

        ClickUpLegend(d, i);
        flagFunnelLegend = -1;
    }
}

function ClickDownLegend(d, i) { }
function ClickUpLegend(d, i) { }
// #endregion
