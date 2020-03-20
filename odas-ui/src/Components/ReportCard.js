import React from 'react';
import Plot from 'react-plotly.js';
//Stylesheets
import "../Layout/Reports.css";
import TitleBar from './TitleBar.js';
import BottomGraph from './BottomGraph.js';
// Redux
import { connect } from 'react-redux';
import {
    fetchSatellites,
    fetchComponents,
    fetchUnits,
    getRecentMeasurements
} from "../Actions";
import {authToken} from "../Definitions/BrowserCookie";
// TODO Bootstrap modals for the logs
class ReportCard extends React.Component {
	constructor(props){
		super(props);
//		this.onClick = this.handleClick.bind(this);
       this.state = {
		line1:{
			x: [], 
			y: [], 
			name: 'Line 1',
			line: {color: 'red' , width: 3},
		},
		layout: {
			autosize: false,
			xaxis: {
				showgrid: true,
				zeroline: true,
				showline: true,
				gridcolor: '#bdbdbd',
				gridwidth: 2,
				zerolinecolor: '#969696',
				zerolinewidth: 4,
				linecolor: '#636363',
				linewidth: 6,
				title: 'Date/Time',
				autotick: true,
				},
			yaxis: {
				showgrid: true,
				zeroline: true,
				showline: true,
				gridcolor: '#bdbdbd',
				gridwidth: 2,
				zerolinecolor: '#969696',
				zerolinewidth: 4,
				linecolor: '#636363',
				linewidth: 6,
				title: 'Measurements',
				autotick: true,
				},
			margin: {
				l: 50,
				r: 50,
				b: 50,
				t: 50,
				pad: 4
			},
			config: {
				responsive: true,
			}, 
			width: 600,
			paper_bgcolor: '#FFFFFF',
			plot_bgcolor: '#000000',
			font: {color:"#000000"},
			datarevision: 0,
		},
		revision: 0,
		cnt : 0,
		initialDataArray: [],
		paused: false, 
		exampleTime: [], 
		alreadyStopped: false,
		exampleValue: [],
		tableKeys: [],
		//plotData: [{"data": false}],
		update: false,
		//out: [],
	}
//	  this.onToggleLoop = this.onToggleLoop.bind(this);
	}		
	componentDidUpdate(nextProps) {
		console.log('Test Update: ', nextProps.recentMeasurements);
		console.log('nextProps', nextProps);
		if(this.props.recentMeasurements.Component!==nextProps.recentMeasurements.Component&&this.props.recentMeasurements.Quantities!==nextProps.recentMeasurements.Quantities&&this.props.recentMeasurements.Measurements!==nextProps.recentMeasurements.Measurements&&this.props.recentMeasurements.Satellite!==nextProps.recentMeasurements.Satellite){
			//if this is a different query
			console.log('State change!');
			this.clearTitleSpecs();
			this.pause = this.pause.bind(this);
			window.cnt = this.state.cnt;
			window.initialDataArray = this.state.initialDataArray;
			window.paused = this.state.paused;
			window.exampleTime = this.state.exampleTime;
			window.alreadyStopped = this.state.alreadyStopped;
			window.exampleValue = this.state.exampleValue;
			window.tableKeys = this.state.tableKeys;
			//	var response = require('./testapi.json');
			var response = this.props.recentMeasurements;
			console.log('update start');
			console.log('response:', response);
			this.initial(response);
			window.interval = setInterval(this.increasePlot,1000);
			console.log('update finish');
		}
		else{
//			this.checkUpdate();
		}
	}
	
	checkUpdate(){
		if(this.state.update===true){
	//		this.setState({update: true});
			this.clearTitleSpecs();
		}
		else{
	
		}
	}
	
	clearTitleSpecs = ()  => {
		console.log('Clear Title Specs');
		var mydiv = document.getElementById("toptitle");
		var mydiv2 = document.getElementById("toptitle2");
		var tableChartDiv = document.getElementById("tablechart");
		if(mydiv.childNodes[1]){
			mydiv.removeChild(mydiv.childNodes[2]);
			mydiv.removeChild(mydiv.childNodes[1]);
		}
		if(mydiv2.childNodes[0]){ 
			mydiv2.removeChild(mydiv2.childNodes[0]);
		}
		while(tableChartDiv.lastElementChild){
			tableChartDiv.removeChild(tableChartDiv.lastElementChild);
		}
		document.getElementById("pause").innerHTML = "Stop Graph";
		//var fieldNamesDiv = document.getElementById("fieldnames");
		//var dataDiv = document.getElementById("data");
		var tracesDiv = document.getElementById("tracesbody");
		/*while(fieldNamesDiv.lastElementChild){
			fieldNamesDiv.removeChild(fieldNamesDiv.lastElementChild);
		}
		while(dataDiv.lastElementChild){
			dataDiv.removeChild(dataDiv.lastElementChild);
		}*/
		var tracesDivCount = 0;
		while(tracesDiv.childNodes[1]){
			tracesDiv.removeChild(tracesDiv.childNodes[1]);
		}
//		Plot.deleteTraces(document.getElementById("graph"), 0);
	//	purge(document.getElementById("graph"));
		this.setState({
			line1:{
			x: [], 
			y: [], 
			name: 'Line 1',
			line: {color: 'red' , width: 3},
		},
		revision: 0,
		cnt : 0,
		initialDataArray: [],
		paused: false, 
		exampleTime: [], 
		alreadyStopped: false,
		exampleValue: [],
		tableKeys: [],});
	}	
	
	componentDidMount() {
		console.log('Component did Mount');
	} 
	
	initial = (response) => {
		console.log('Test Initial', response);
//	this.setState({out: response});
//	console.log('testa', this.state.out);
//		this.clearTitleSpecs();
		var compSpecified = false;
		var out = response;
		this.checkData(out, compSpecified);
	}

	compare = (key,a,b) => {
		if(a.key<b.key){
			return -1;
		}
		if(a.key>b.key){
			return 1;
		}
		return 0;
	}			
	titleSpecs = (out)  => {
			var mydiv = document.getElementById("toptitle");
			var newcontent = document.createElement('div');
			newcontent.innerHTML = out.Satellite.name;
			var mydiv2 = document.getElementById("toptitle2");
			var newcontent2 = document.createElement('div');
			newcontent2.innerHTML = ": Launched "+out.Satellite.year_launched;
			var newcontent3 = document.createElement('div');
			newcontent3.innerHTML = ""+out.Satellite.mission_description;
			while (newcontent.firstChild) {
				mydiv.appendChild(newcontent.firstChild);
				mydiv.appendChild(newcontent2.firstChild);
				mydiv2.appendChild(newcontent3.firstChild);
			}
	}
	checkCompSpecified = (out, compSpecified) => {
		compSpecified = out.comp_specified;
		console.log('Test 2: Component Specified?: ', compSpecified);
		return compSpecified;
	}
	checkQuantitiesMatch = (quantity, realQuantity, checkQuantities)  => {
		if(quantity===realQuantity){
			checkQuantities = true;
			return checkQuantities;
			//window.checkQuantities = true;
		}
		console.log('Quantity: ', quantity);
		console.log('Real Quantity: ', realQuantity);
		console.log('Test : Quantities Match? : ', checkQuantities);
		if(quantity===realQuantity===0){
			console.log('Error: No Data');
		}
		return checkQuantities;
	}
	errorOutput = (error) =>  {
			var mydiv = document.getElementById("toptitle");
			var newcontent = document.createElement('div');
			newcontent.innerHTML = "Error";
			while (newcontent.firstChild) {
				mydiv.appendChild(newcontent.firstChild);
			}
			var node = document.createElement("p");
			var node2 = document.createElement("p");
			var textnode = document.createTextNode(error);
			var textnode2 = document.createTextNode(error);
			node.appendChild(textnode);
			node2.appendChild(textnode2);
			document.getElementById("toptitle").appendChild(node);
			document.getElementById("tablechart").appendChild(node2);
		}
	
	checkData = (out, compSpecified) => {
		console.log('testb', out);
				var error;
				if(out.data===true){//this.plotData.data===true){
					this.titleSpecs(out);
					compSpecified = false;
					compSpecified = this.checkCompSpecified(out, compSpecified);
					var quantity = out.Quantities.CPU; //Quantity has been replaced; therefore, quantity test should always fail.
					var realQuantity = 0;
					realQuantity = out.Measurements.length;
					var checkQuantities = false;
					this.checkQuantitiesMatch(quantity, realQuantity, checkQuantities);
					this.createDataUnit(out, realQuantity, compSpecified);
				}
				else if(out.data===false){//||this.plotData.data===true){
					error = out.error;
					this.errorOutput(error);
				}
				else{
					error = "Error: The API is not in the correct JSON format. Please check again."
					this.errorOutput(error);
				}		
	}
	createDataUnit = (out, realQuantity, compSpecified) => {
				for(var c=0;c<realQuantity;c++){
					var dataUnit = [];
					var data = [];
					if(compSpecified === true){
						dataUnit.push(out.Component.category);
						dataUnit.push(out.Component.description);
						dataUnit.push(out.Component.model);
						dataUnit.push(out.Component.name);
					}
						dataUnit.push(out.Measurements[c].time);
						dataUnit.push(out.Measurements[c].units);
						dataUnit.push(out.Measurements[c].value);
						data.push(dataUnit);
				}
					var outSort = out;
					this.sortMeasurements(outSort, realQuantity, compSpecified);
			}
	
	sortMeasurements = (outSort, realQuantity, compSpecified) => {
				outSort.Measurements.sort(this.compare.bind(null, 'units'));
				var allUnits = [];
				var allNames = [];
				var sortedMeasurements = [];
					for(var a=0;a<realQuantity;a++){
						sortedMeasurements.push(outSort.Measurements[a]);
						allUnits.push(outSort.Measurements[a].units);
						if(compSpecified===true){
							allNames.push(outSort.Measurements[a].component_name);//[0]);
						}
					}
				this.makeParameters(allUnits, allNames, realQuantity, sortedMeasurements, compSpecified);				
			}
	makeParameters = (allUnits, allNames, realQuantity, sortedMeasurements, compSpecified) => {
				var distinct = (value, index, self) => {
					return self.indexOf(value) === index;
				}
				var distinctUnits = allUnits.filter(distinct);
				var numUniqueUnits = distinctUnits.length;
				var distinctNames = allNames.filter(distinct);
				var numUniqueNames = distinctNames.length;
				
				var totalNumGraphs = numUniqueUnits*numUniqueNames;
				if(compSpecified === false){
					totalNumGraphs = numUniqueUnits;
				}
				this.makeGraphArray(totalNumGraphs, numUniqueNames, distinctNames, numUniqueUnits, distinctUnits, realQuantity, sortedMeasurements, compSpecified);
			}
			
	makeGraphArray = (totalNumGraphs, numUniqueNames, distinctNames, numUniqueUnits, distinctUnits, realQuantity, sortedMeasurements, compSpecified) => {
				var totalGraphsArray = [];
				for(var u=0;u<totalNumGraphs;u++){
					//make dummy positions
					var dummyGraph = [];
					totalGraphsArray.push(dummyGraph);
				}
							
				if(compSpecified === false){
					numUniqueNames = 1;
				}
							
				for(var a=0;a<realQuantity;a++){
					for(var b=0;b<numUniqueUnits;b++){
						for(var c=0;c<numUniqueNames;c++){
							if(sortedMeasurements[a].units===distinctUnits[b]){
								if(sortedMeasurements[a].component_name===distinctNames[c]){
									totalGraphsArray[b*numUniqueNames+c].push(sortedMeasurements[a]);
								}
							}
						}
					}
				}
				this.reorder(totalGraphsArray, totalNumGraphs, compSpecified);
			}
			reorder = (totalGraphsArray, totalNumGraphs, compSpecified) => {
				//Flip components to list them in correct sequential order.
				for(var a=0;a<totalGraphsArray.length;a++){
					if(totalGraphsArray[a].length>1){
						totalGraphsArray[a].reverse();
						if(compSpecified===false){
							totalGraphsArray[a].sort(this.compare.bind(null, 'time'));
						}
					}
				}
				this.setGraphType(totalGraphsArray, totalNumGraphs, compSpecified);
			}
			setGraphType = (totalGraphsArray, totalNumGraphs, compSpecified) => {
				var altcurrentData = [];
				for(var a=0;a<totalNumGraphs;a++){
					if (totalGraphsArray[a].length!==0&&totalGraphsArray[a].length!==null){
						for(var b=0;b<totalGraphsArray[a].length;b++){
							altcurrentData.push(totalGraphsArray[a][b].value);
						}
					}
				}
							
				var testIndex;
				var exampleGraphData = [];
				if(compSpecified===true){
					testIndex = 3; //example.
					exampleGraphData = totalGraphsArray[0][testIndex]; //example. 3 
				}
				else{
					testIndex = 0;
					exampleGraphData = totalGraphsArray[0];//[testIndex]; //example. 3 
				}
				this.plotGraph(compSpecified, exampleGraphData);
			}
			plotGraph = (compSpecified, exampleGraphData) => {
				var exampleTime = [];
				var exampleValue = [];
				for(var a=0;a<exampleGraphData.length;a++){
					exampleTime.push(exampleGraphData[a].time); //x
								exampleValue.push(exampleGraphData[a].value); //y
							}
				var table = document.getElementById("tracesbody");
				var row = table.insertRow(table.rows.length-1); //insert row at bottom
				var initialDataArray = exampleGraphData;//totalGraphsArray[0];//[testIndex];
				var tableKeys = [];
				if(compSpecified===false){
					//for(var a=0;a<initialDataArray[0].length;a++){
					var keysHold = (Object.keys(initialDataArray[0]));
					//}
					tableKeys = keysHold;
				}
				else{
					tableKeys = Object.keys(initialDataArray);
				}
				for(var b=0;b<tableKeys.length;b++){
					var cellAdd = row.insertCell(b);
					var toChart = tableKeys[b];
					cellAdd.innerHTML = (toChart);
				}
				var paused = false;
				var alreadyStopped = false;
				document.getElementById("pause").addEventListener('click', this.pause);
				window.initialDataArray = initialDataArray;
				window.paused = paused;
				window.exampleTime = exampleTime;
				window.alreadyStopped = alreadyStopped;
				window.exampleValue = exampleValue;
				window.tableKeys = tableKeys;
						}

					pause = () => {
							window.paused = true;
							this.setState({paused: true});
						}	

					increasePlot = () => {
								var initialDataArray = window.initialDataArray;
								var cnt = this.state.cnt;
								var paused = this.state.paused; 
								var exampleTime = window.exampleTime;
								var alreadyStopped = this.state.alreadyStopped;
								var exampleValue = window.exampleValue;   
								var tableKeys = window.tableKeys;
								if(paused === true){
									document.getElementById("pause").innerHTML = "PAUSED";//Date();
									clearInterval(window.interval);
								}
								if(cnt<initialDataArray.length){
								var initialY = this.getY(cnt, initialDataArray, exampleValue, alreadyStopped, paused, tableKeys);
								var initialX = this.getX(cnt, exampleTime, alreadyStopped, paused);
								const { line1, layout } = this.state;
								line1.x.push(initialX);
								line1.y.push(initialY);
								if (line1.x.length >= 500) {
									line1.x.shift();
									line1.y.shift();
								} 
								if(paused === true){
									document.getElementById("pause").innerHTML = "PAUSED";//Date();
									clearInterval(window.interval);
								}
								this.setState({ revision: this.state.revision + 1 , cnt: this.state.cnt + 1, paused: window.paused, initialDataArray: window.initialDataArray, exampleTime: window.exampleTime, exampleValue: window.exampleValue, tableKeys: window.tableKeys});
								layout.datarevision = this.state.revision + 1;
								}
								else{
									document.getElementById("pause").innerHTML = "STOPPED";//Date();
									clearInterval(window.interval);
								}
							}

							getX = (count, exampleTime, alreadyStopped, paused) => {
								if(exampleTime[count]!==null){
									return exampleTime[count];
								}
								else{
									if(alreadyStopped===false){
										window.paused = true;
										clearInterval(window.interval);
										window.alreadyStopped=true;
									}
								}
							}
							
							getY = (count, initialDataArray, exampleValue, alreadyStopped, paused, tableKeys) => {
								if(exampleValue[count]!==null){
									this.getData(count, initialDataArray, tableKeys);
									return exampleValue[count];
								}
								else{
									if(alreadyStopped===false){
										window.paused = true;
										clearInterval(window.interval);
										window.alreadyStopped = true;
									}
								}
							}
							
						getData = (cnt, initialDataArray, tableKeys) => {
								var table = document.getElementById("tracesbody");
								var row = table.insertRow(table.rows.length-1); //insert row at bottom	
								if(initialDataArray[cnt]!==null){		
									tableKeys = Object.values(initialDataArray[cnt]);
									for(var a=0;a<tableKeys.length;a++){
										var cellAdd = row.insertCell(a);
										var toChart = tableKeys[a];
										cellAdd.innerHTML = (toChart);
										}
								}
							}  

  render() {
        return (
        <div {...this.props} className={"card-container"}>{this.props.children}
            <div {...this.props} className={"card"}>{this.props.children}
                <div className={"graph-report"}>{this.props.children}
				          <TitleBar></TitleBar>
					         <Plot 
					          data={[this.state.line1]}
					          layout = {this.state.layout}
					          revision={this.state.revision}
					          graphDiv = "graph"
					          /> 
					         <BottomGraph></BottomGraph>
                </div>
             </div>
          </div>
        );
    }
}
const mapStateToProps = state => {
    return {
        components: state.components,
        satellites: state.fetchSatellites,
        units: state.fetchUnits,
        recent: state.selectRecent,
        recentMeasurements: state.getRecentMeasurements
    };
};

export default connect(mapStateToProps, {
    fetchSatellites,
    fetchUnits,
    fetchComponents,
    getRecentMeasurements
})(ReportCard)