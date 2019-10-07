
// #region MetaData

// This function using to draw Vertical Bar Chart, and return object that contains object for each part of chart,
// you can use those objects to make your chart resposive.
// In the engine event on legendClick and part of slices based on xScale labels Clicked, 
// IF you want to override all functionality of event you can using those signatures to create your functions:   
//      function OnMouseLegendClick(d, i){} => for lengend event Clicked
//      function OnMouseBarChartClicked(d, i){} => for each part of slices based on yScale labels Clicked

// IF you want to increase some of your functionality for main functionality of each event you can using those signatures to create your functions:
//       function CLickDownLegend(d, i){} => for Legend event clicked this fired when clicked down only on each part of legend
//       function ClickUpLegend(d, i){} => for Legend event clicked this fired when clicked Up only on each part of legend
//       You can use the above two methods to subscribe all event of legend event (DOWN/UP)
//       function CLickDownBarChart(d, i){} => for partOFBarChart based on YScale labels, event clicked this fired when clicked down only on each part of legend
//       function ClickUpBarChart(d, i){} => for partOFBarChart based on YScale labels, event clicked this fired when clicked down only on each part of legend

// It take an object that contains some of property that using to draw the chart:
// 1- divClassName: it is a mandatory you set class name of DIV which is want to draw the chart in it
// 2- height: it is a mandatory, it set a height of main SVG
// 3- SVG: it is an optional property, you can set it with exist SVG object ,if you draw exist chart and want to draw new chart above it
// 4- NumberOfSlice: It is a mandatory , it is a number of slices that you want to draw its with the chart
// 5- yScaleMaxNumber: It is a mandatory, it is a max number that using to draw Scale
// 6- dataSet: It is a mandatory , it must contains some of property as:
//      {Label: 'Label 01' ,ClassName: 'A A01' , ValueItem0: 22 , ValueItem1: 34 , ....},
//      {Label: 'Label 01' ,ClassName:'B', ValueItem0: 25 , ValueItem1: 55 , ....}    
//      Label => Items that occurs in yScale
//      ValueItem0 / ValueItem1 / ValueItem[n] => Its are Values of Slices , each ValueItem[n] act as Slice.
//      ClassName => If you want to add class name for each slice
// 7- title: It is an optional, you can set Title for Chart
// 8- colors: It is a mandatory, set it as array of colors that you want to using those to color slices
// 9- dataLegend: It is an optional , you can set it if you want to show Legned, but you must set array of names in order as order of slices as
//      ['valueItem1' , 'valueItem2' , ...] each value here must be name that you want to  occure in legend and much each slice
// 10- xScaleTitle: It is an optional, you can set it with string value if you want to occure title for XScale
// 11- yScaleTitle: It is an optional, you can set it with string value if you want to occure title for YScale
// 12- ShowLabels: It is an optional , you can set it with TRUE if you want to show values of each slice with it.
// 13- ShowXScale: It is an optional , you can set it with TRUE if you want to show XLine.
// 14- ShowYScale: It is an optional , you can set it with TRUE if you want to show YLine.
// 15- HiddenYTips: It is an optional, you can set it if you want to hidden the lines of YScale
// 16- HiddenXTips: It is an optional, you can set it if you want to hidden the lines of XScale

// #endregion

function DrawVerticalBarChart({ divClassName, height, SVG, NumberOfSlice, yScaleMaxNumber, dataSet, title, colors, dataLegend, xScaleTitle, yScaleTitle, ShowLabels = false, ShowXScale = false, ShowYScale = false, HiddenYTips = false, HiddenXTips = false }) {
    let result = {};
    // #region MAin SVG
    let color = d3.scaleOrdinal(colors);
    let svgWidth;
    let svgBar;
    if (SVG == undefined) {
        svgBar = d3.select("." + divClassName)
            .append("svg")
            .attr('class', 'svgBar')
            .attr("height", height)
    } else {
        svgBar = SVG;
    }
    svgWidth = parseInt(svgBar.style("width").substring(0, svgBar.style("width").length - 2));
    result.SVG = svgBar;
    result.SvgWidth = svgWidth;
    // #endregion

    // #region XScale && YScale
    let xScale = d3.scaleBand()
        .domain(dataSet.map((d) => d.Label))
        .range([0, svgWidth - 150])
        .padding(0.1);
    if (ShowXScale) {
        let gXScale = svgBar.append("g")
            .attr('class', "xScale")
            .attr("transform", 'translate(100 , ' + (height - 50) + ')')
            .call(d3.axisBottom(xScale));
        result.gXScale = gXScale;
    }
    if (xScaleTitle != undefined) {
        let gXScaleTitle = svgBar.append("g")
            .attr('class', "xScaleTitle")
            .attr("transform", 'translate(' + (svgWidth / 2) + ' , ' + (height - 10) + ')')
            .append('text')
            .text(xScaleTitle);
        result.xScaleTitle = gXScaleTitle;
    }

    let yScale = d3.scaleLinear()
        .domain([0, yScaleMaxNumber])
        .range([height - 100, 0])
    if (ShowYScale) {
        let gYScale = svgBar.append("g")
            .attr('class', "yScale")
            .attr("transform", 'translate(100 , ' + 50 + ')')
            .call(d3.axisLeft(yScale));
        result.gYScale = gYScale;
    }

    if (yScaleTitle != undefined) {
        let gYScaleTitle = svgBar.append("g")
            .attr('class', "yScaleTitle")
            .attr("transform", 'translate(40 , ' + (height / 2) + ')')
            .append('text')
            .text(yScaleTitle)
            .attr('transform', 'rotate(-90)');
        result.yScaleTitle = xScaleTitle;
    }
    // #endregion

    // #region Title
    if (title != undefined) {
        let gBarTitle = svgBar.append('text')
            .attr('class', 'gBarTitle')
            .attr("transform", 'translate(' + ((svgWidth / 2)) + ' , ' + 10 + ')')
            .text(title)
            .attr('font-size', '12')
            .attr('font-weight', 'bold');
        result.gBarTitle = gBarTitle;
    }
    // #endregion

    // #region Draw Bar Chart
    let prevIndex = 0;
    for (let index = 1; index <= NumberOfSlice; index++) {
        let gBarChart = svgBar.append("g")
            .attr('class', 'gBarChart' + dataLegend[index - 1])
            .attr("transform", 'translate(100 , ' + (50) + ')');
        gBarChart.selectAll('.g' + dataLegend[index - 1])
            .data(dataSet)
            .enter()
            .append('rect')
            .attr("class", (d) => (dataLegend != undefined ? dataLegend[index - 1] : '') + ' BarChat ' + d.Label.replace(/\s/g, '') + ' ' + (d.ClassName != undefined ? d.ClassName : ''))
            .attr('x', (d) => xScale(d.Label) + (index != prevIndex ? 0 : (xScale.bandwidth() / NumberOfSlice) * (index - 1)))
            .attr("y", (d) => yScale(d['ValueItem' + (index - 1)]))
            .attr('width', xScale.bandwidth() / NumberOfSlice - 1)
            .attr("height", (d) => (height - yScale(d['ValueItem' + (index - 1)]) - 100))
            .attr('fill', color(index))
            .on('mousedown', OnMouseBarChartClicked)


        if (ShowLabels) {
            let gBarChartLabel = svgBar.append("g")
                .attr('class', 'gBarChartLabel' + dataLegend[index - 1])
                .attr("transform", 'translate(100 , ' + (45) + ')');
            gBarChartLabel.selectAll('.' + dataLegend[index - 1])
                .data(dataSet)
                .enter()
                .append('text')
                .attr("class", d => dataLegend[index - 1] + ' label' + d.Label.replace(/\s/g, ''))
                .text((d) => d['ValueItem' + (index - 1)])
                .attr('x', (d) => xScale(d.Label) + (index != prevIndex ? 0 : (xScale.bandwidth() / NumberOfSlice) * (index - 1)) + ((xScale.bandwidth() / NumberOfSlice - 1) / 2) - 10)
                .attr("y", (d) => yScale(d['ValueItem' + (index - 1)]))
                .attr('font-size', '12')
                .on('mousedown', OnMouseBarChartClicked)
        }
        prevIndex = index + 1;
        result['gBarChartItem' + index] = gBarChart;
    }
    // #endregion

    // #region Draw Legend
    if (dataLegend != undefined) {
        let gLegendBarText = svgBar.append('g')
            .attr('class', 'gLegendBarText')
            .attr("transform", 'translate(' + 106 + ' , ' + 50 + ')');
        gLegendBarText.selectAll('.txt')
            .data(dataLegend)
            .enter()
            .append('text')
            .text((d) => d)
            .attr('class', (d) => d + ' legendText')
            .attr('x', (d, i) => i * 110)
            .attr('y', '-15')
            .attr('font-size', '12')
            .on('mousedown', OnMouseLegendClick);

        let gLegendBarColor = svgBar.append('g')
            .attr('class', 'gLegendBarColor')
            .attr("transform", 'translate(100 , ' + 50 + ')');
        gLegendBarColor.selectAll('.txt')
            .data(dataLegend)
            .enter()
            .append('circle')
            .attr('class', (d) => d + ' Legend')
            .attr('cx', (d, i) => i * 110)
            .attr('cy', '-20')
            .attr('r', '6')
            .attr('fill', (d, i) => color(i + 1))
            .on('mousedown', OnMouseLegendClick);

        result.gLegendBarText = gLegendBarText;
        result.gLegendBarColor = gLegendBarColor;
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
let flag = -1;
function OnMouseLegendClick(d, i) {
    if (flag != i) {
        d3.selectAll('.BarChat')
            .attr('opacity', '0.3');
        d3.selectAll('.Legend')
            .attr('opacity', '0.3');
        d3.selectAll('.' + d)
            .attr('opacity', '1');

        CLickDownLegend(d, i);
        flag = i;
    } else {
        d3.selectAll('.BarChat')
            .attr('opacity', '1');
        d3.selectAll('.Legend')
            .attr('opacity', '1');

        ClickUpLegend(d, i);
        flag = -1;
    }
}
let flagBar = -1;
function OnMouseBarChartClicked(d, i) {
    if (flagBar != i) {
        d3.selectAll('.BarChat')
            .attr('opacity', '0.3');
        d3.selectAll('.' + d.Label.replace(/\s/g, ''))
            .attr('opacity', '1');
        d3.selectAll('.Legend')
            .attr('opacity', '1');

        CLickDownBarChart(d, i);
        flagBar = i;
    } else {
        d3.selectAll('.BarChat')
            .attr('opacity', '1');

        ClickUpBarChart(d, i);
        flagBar = -1;
    }
}

function CLickDownLegend(d, i) { }
function ClickUpLegend(d, i) { }
function CLickDownBarChart(d, i) { }
function ClickUpBarChart(d, i) { }
// #endregion

