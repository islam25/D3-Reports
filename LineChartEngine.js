
// #region MetaData

// This function using to draw Line Chart, and return object that contains object for each part of chart,
// you can use those objects to make your chart resposive.
// In the engine event on legendClick, 
// IF you want to override all functionality of event you can using those signatures to create your functions:   
//      function OnMouseLegendClick(d, i){} => for lengend event Clicked
//      function OnMouseCircleClicked(d, i){} => for each circle if you draw circles on each point of line chart.

// IF you want to increase some of your functionality for main functionality of each event you can using those signatures to create your functions:
//       function MouseLegendDown(d, i){} => for Legend event clicked this fired when clicked down only on each part of legend
//       function MouseLegendUp(d, i){} => for Legend event clicked this fired when clicked Up only on each part of legend
//       You can use the above two methods to subscribe all event of legend event (DOWN/UP)
//       function MouseCircleDown(d, i){} => for EachCirclePoint down Clicked
//       function MouseCircleUp(d, i){} => for EachCirclePoint down Clicked

// It take an object that contains some of property that using to draw the chart:
// 1- divClassName: It is a mandatory you set class name of DIV which is want to draw the chart in it
// 2- height: it is a mandatory, it set a height of main SVG
// 3- lineClassName: It is an optional if you want to set class name for each line.
// 4- SVG: it is an optional property, you can set it with exist SVG object ,if you draw exist chart and want to draw new chart above it
// 5- yScaleMaxNumber: It is a mandatory, it is a max number that using to draw yScale
// 6- numberOfYScaleTicks: It is an optional, it set number of ticks of yScale.
// 7- dataSet: It is a mandatory , it must contains some of property as:
//      {Label: 'Label 01' , Value: 22 },
//      {Label: 'Label 01' , Value: 25 }    
//      Label => Items that occurs in yScale
//      Value => Its are Values of line ,
// 7- title: It is an optional, you can set Title for Chart
// 8- color: It is a mandatory, it a color of line.
// 9- dataLegend: It is an optional , you can set it if you want to show Legned, but you must set array of names in order as order of lines as
//      ['valueItem1' , 'valueItem2' , ...] each value here must be name that you want to  occure in legend and much each slice
// 10- xScaleTitle: It is an optional, you can set it with string value if you want to occure title for XScale
// 11- yScaleTitle: It is an optional, you can set it with string value if you want to occure title for YScale
// 12- ShowCirclePoint: It is an optional , you can set it with TRUE if you want to show circles of each point of line.
// 12- ShowLabelPoint: It is an optional , you can set it with TRUE if you want to show values of each point of line.
// 13- ShowXScale: It is an optional , you can set it with TRUE if you want to show XLine.
// 14- ShowYScale: It is an optional , you can set it with TRUE if you want to show YLine.
// 15- HiddenYTips: It is an optional, you can set it with TRUE if you want to hidden the lines of YScale
// 16- HiddenXTips: It is an optional, you can set it with TRUE if you want to hidden the lines of XScale
// 17- IsDashed: It is an optional, you can set it with TRUE you want to make the line is dashed.
// 18- showHorizontalLines: It is an optional, you can set it with true if you want to draw Horizontal Lines
// 19- ShowHoveredLine: It is an optional, you can set it with true if you want to draw Hovered Line.
// #endregion

function DrawLineChart({ divClassName, lineClassName, SVG, height, yScaleMaxNumber, numberOfYScaleTicks, dataSet, title, color, dataLegend, colorsLegend, xScaleTitle, yScaleTitle, ShowCirclePoint = false, ShowLabelPoint = false, ShowXScale = false, ShowYScale = false, HiddenYTips = false, HiddenXTips = false, IsDashed = false, showHorizontalLines = false, ShowHoveredLine = false }) {
    let result = {};
    // #region MAin SVG
    let svgWidth;
    let svgLine;
    // let height = height;
    if (SVG == undefined) {
        svgLine = d3.select("." + divClassName)
            .append("svg")
            .attr('class', 'svgLine')
            .attr("height", height)
    } else {
        svgLine = SVG;
    }
    svgWidth = parseInt(svgLine.style("width").substring(0, svgLine.style("width").length - 2));
    result.SVG = svgLine;
    let colorLegend = colorsLegend != undefined ? d3.scaleOrdinal(colorsLegend) : '';
    result.SvgWidth = svgWidth;
    // #endregion

    // #region XScale && YScale
    let xScale = d3.scaleBand()
        .domain(dataSet.map((d) => d.Label))
        .range([0, svgWidth - 150])
        .padding(0.1);

    if (ShowXScale) {
        let gXScale = svgLine.append("g")
            .attr('class', "xScale")
            .attr("transform", 'translate(100 , ' + (height - 50) + ')')
            .call(d3.axisBottom(xScale));
        result.gXScale = gXScale;
    }

    if (xScaleTitle != undefined) {
        let gXScaleTitle = svgLine.append("g")
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
        let gYScale = svgLine.append("g")
            .attr('class', "yScale")
            .attr("transform", 'translate(100 , ' + 50 + ')')
            .call(d3.axisLeft(yScale).ticks(numberOfYScaleTicks));
        result.gYScale = gYScale;
    }

    if (yScaleTitle != undefined) {
        let gYScaleTitle = svgLine.append("g")
            .attr('class', "yScaleTitle")
            .attr("transform", 'translate(40 , ' + (height / 2) + ')')
            .append('text')
            .text(yScaleTitle)
            .attr('transform', 'rotate(-90)');
        result.yScaleTitle = xScaleTitle;
    }
    // #endregion

    // #region Hover Lines
    if (ShowHoveredLine) {
        var resultdd = [];
        dataSet.forEach((d) => {
            resultdd.push({ Label: d.Label, Value: yScale.ticks()[yScale.ticks().length - 1] });
        })
        let gBarChartForHoverLines = svgLine.append('g')
            .attr('class', 'gBarChartForHoverLines')
            .attr('transform', 'translate(100,' + 50 + ')')
        gBarChartForHoverLines.selectAll('.Lines')
            .data(resultdd)
            .enter()
            .append('rect')
            .attr('x', (d) => xScale(d.Label))
            .attr('y', (d) => yScale(d.Value))
            .attr('width', xScale.bandwidth())
            .attr('height', (d) => height - yScale(d.Value) - 100)
            .attr('fill', (d, i) => 'white')
            .on('mouseover', OnMouseHoverBarChart)
            .on('mouseout', OnMouseOutBarChart)

        let transformXscaleTick = d3.selectAll('.xScale .tick')._groups[0][0].getAttribute('transform');
        let xTickXScale = parseInt(transformXscaleTick.substring(transformXscaleTick.indexOf('(') + 1, transformXscaleTick.indexOf(',')));
        let gBarChartForHover = svgLine.append('g')
            .attr('class', 'gBarChartForHoverLines')
            .attr('transform', 'translate(' + (xTickXScale + 95) + ',50)')

        DrawHoverLine(gBarChartForHover, height, resultdd, xScale, yScale)
    }
    // #endregion

    // #region showHorizontalLines
    if (showHorizontalLines) {
        let gBarLine = svgLine.append('g')
            .attr('class', 'gBarLine')
            .attr("transform", 'translate(100 , ' + 50 + ')')

        for (let index = 0; index < yScale.ticks().length; index++) {
            if (d3.selectAll(".yScale .tick")._groups[0][index] != undefined) {
                gBarLine.append('line')
                    .attr('class', 'lines')
                    .attr('x2', svgWidth - 150)
                    .attr('transform', d3.selectAll(".yScale .tick")._groups[0][index].getAttribute("transform"))
                    .attr('stroke', 'gray')
                    .attr('opacity', '0.2')
            }
        }
    }
    // #endregion

    // #region Title
    if (title != undefined) {
        let gBarTitle = svgLine.append('text')
            .attr('class', 'gLineTitle')
            .attr("transform", 'translate(' + ((svgWidth / 2)) + ' , ' + 30 + ')')
            .text(title)
            .attr('font-size', '12')
            .attr('font-weight', 'bold');
        result.gBarTitle = gBarTitle;
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

    // #region DrawMainLine

    var Line = d3.line()
        .x((d) => xScale(d.Label))
        .y((d) => yScale(d.Value))

    let gMainLines = svgLine.append('g')
        .attr('class', 'mainLines')
        .attr('transform', 'translate(120,' + 50 + ')');
    let gLine = gMainLines.append('g')
        .attr('class', 'gLine');
    gLine.selectAll('.lines')
        .data(dataSet)
        .enter()
        .append('path')
        .attr('class', (d) => "Line " + (lineClassName != undefined ? lineClassName : '') + 'Line')
        .attr('d', (d) => Line(dataSet))
        .attr('fill', 'none')
        .attr('stroke', color);

    result.gLine = gLine;

    if (ShowCirclePoint) {
        let gnoteCircleLine = gMainLines.append('g')
            .attr('class', 'gnoteCircleLine');
        gnoteCircleLine.selectAll('.circle')
            .data(dataSet)
            .enter()
            .append('circle')
            .attr('class', (d) => "Circle " + d.Label.replace(/\s/g, '') + ' ' + (lineClassName != undefined ? lineClassName : '') + 'Circle')
            .attr('cx', (d) => xScale(d.Label) + 2)
            .attr('cy', (d) => yScale(d.Value))
            .attr('r', '5')
            .attr('fill', color)
            .on('mousedown', OnMouseCircleClicked);
        result.gnoteCircleLine = gnoteCircleLine;
    }

    if (ShowLabelPoint) {
        let gnoteTextLine = gMainLines.append('g')
            .attr('class', 'gnoteTextLine');
        gnoteTextLine.selectAll('.txt')
            .data(dataSet)
            .enter()
            .append('text')
            .attr('class', (d) => "numbers " + d.Label.replace(/\s/g, '') + ' ' + (lineClassName != undefined ? lineClassName : '') + 'Label')
            .text((d) => d.Value)
            .attr('x', (d) => xScale(d.Label) - 15)
            .attr('y', (d) => yScale(d.Value) - 15)
            .attr('font-size', '10');
        result.gnoteTextLine = gnoteTextLine;
    }

    // #endregion

    // #region Draw Legend
    if (dataLegend != undefined) {
        d3.selectAll('.svgLine')
            .attr('height', (parseInt(svgLine.style("height").substring(0, svgLine.style("height").length - 2)) + 40))

        let gLegendBarText = svgLine.append('g')
            .attr('class', 'gLegendBarText')
            .attr("transform", 'translate(' + ((svgWidth / 2) - (dataLegend.length * 40)) + ' , ' + (height + 30) + ')');
        gLegendBarText.selectAll('.txt')
            .data(dataLegend)
            .enter()
            .append('text')
            .text((d) => d)
            .attr('class', (d) => d + ' legendText')
            .attr('x', (d, i) => i * 100)
            .attr('y', '-15')
            .attr('font-size', '12')
            .on('mousedown', OnMouseLegendClick);

        let gLegendBarColor = svgLine.append('g')
            .attr('class', 'gLegendBarColor')
            .attr("transform", 'translate(' + ((svgWidth / 2) - (dataLegend.length * 40)) + ' , ' + (height + 30) + ')');
        gLegendBarColor.selectAll('.txt')
            .data(dataLegend)
            .enter()
            .append('circle')
            .attr('class', (d) => d + ' Legend')
            .attr('cx', (d, i) => (i * 100) - 7)
            .attr('cy', '-20')
            .attr('r', '6')
            .attr('fill', (d, i) => colorLegend(i))
            .on('mousedown', OnMouseLegendClick);

        result.gLegendBarText = gLegendBarText;
        // result.gLegendBarColor = gLegendBarColor;
    }
    // #endregion

    // #region check if line dashed
    if (IsDashed) {
        d3.selectAll('.' + lineClassName + 'Line')
            .style("stroke-dasharray", ("10, 3"));
    }
    // #endregion


    return result;
}

// #region Event Methods 

let flagLine = -1;
function OnMouseCircleClicked(d, i) {
    if (flagLine != i) {
        d3.selectAll('.Circle')
            .attr('opacity', '0.4');
        d3.selectAll('.Line')
            .attr('opacity', '0.1');
        d3.selectAll('.numbers')
            .attr('opacity', '0.3');
        d3.selectAll('.' + d.Label.replace(/\s/g, ''))
            .attr('opacity', '1');

        MouseCircleDown(d, i);
        flagLine = i;
    } else {

        d3.selectAll('.Circle')
            .attr('opacity', '1');
        d3.selectAll('.Line')
            .attr('opacity', '1');
        d3.selectAll('.numbers')
            .attr('opacity', '1');

        MouseCircleUp(d, i);
        flagLine = -1;
    }
}
function MouseCircleDown(d, i) { }
function MouseCircleUp(d, i) { }

let flagLineLegend = -1;
function OnMouseLegendClick(d, i) {
    if (flagLineLegend != i) {
        d3.selectAll('.Legend')
            .attr('opacity', '0.3');
        d3.selectAll('.Line')
            .attr('opacity', '0.1');
        d3.selectAll('.Circle')
            .attr('opacity', '0.3');
        d3.selectAll('.numbers')
            .attr('opacity', '0.3');

        d3.selectAll('.' + d)
            .attr('opacity', '1');
        d3.selectAll('.' + d + 'Circle')
            .attr('opacity', '1');
        d3.selectAll('.' + d + 'Label')
            .attr('opacity', '1');

        MouseLegendDown(d, i);
        flagLineLegend = i;
    } else {
        d3.selectAll('.Legend')
            .attr('opacity', '1');
        d3.selectAll('.Circle')
            .attr('opacity', '1');
        d3.selectAll('.Line')
            .attr('opacity', '1');
        d3.selectAll('.numbers')
            .attr('opacity', '1');

        MouseLegendUp(d, i);
        flagLineLegend = -1;
    }
}
function MouseLegendDown(d, i) { }
function MouseLegendUp(d, i) { }


function DrawHoverLine(gBarChartForHover, height, resultdd, xScale, yScale) {
    gBarChartForHover.selectAll('.Lines')
        .data(resultdd)
        .enter()
        .append('rect')
        .attr('class', (d) => 'sprint ' + d.Label.replace(/\s/g, '') + 'hover')
        .attr('x', (d) => xScale(d.Label))
        .attr('y', (d) => yScale(d.Value))
        .attr('width', '1')
        .attr('height', (d) => height - yScale(d.Value) - 100)
        .attr('fill', 'gray')
        .attr('opacity', '0');
}
function OnMouseHoverBarChart(d, i) {
    d3.selectAll('.' + d.Label.replace(/\s/g, '') + 'hover')
        .attr('opacity', '1');
    DrawHoverLine(gBarChartForHover, height, resultdd, xScale, yScale)
}
function OnMouseOutBarChart(d, i) {
    d3.selectAll('.' + d.Label.replace(/\s/g, '') + 'hover')
        .attr('opacity', '0');
}
// #endregion