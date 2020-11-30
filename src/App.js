
import './App.css';
import { Graph } from "react-d3-graph";
import React, { Component } from "react";
import config from "./config.js"
import dat from "./data.js"
import linedata from "./linedata.js"
import { scaleThreshold  } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';
// import BarChart from './BarChart';
import {BarChart, LineChart} from 'react-d3-components';
// graph payload (with minimalist structure)
// the graph configuration, you only need to pass down properties
// that you want to override, otherwise default ones will be used
const myConfig = config;
var dblNode = null;
var susCol = "DarkKhaki";
var prevCol =  susCol;
class App extends Component {
  constructor() {
    super();
    
    this.state = {
      data: dat,
      recChance: 0.9,
      inChance: 0.6,
      intervalId: null,
      LightCoralNodes: 1,
      MediumAquaMarineNodes: 0,
      susNodes: 13,
      simSpeed: 1000,
      linedata: linedata,
      xVal: 0,
      
    };
    this.changeInChance = this.changeInChance.bind(this)
    this.changeRecChance = this.changeRecChance.bind(this)
    this.changeSimSpeed = this.changeSimSpeed.bind(this)
  }
  changeInChance(e) {
      if(e.target.value <= 1 && e.target.value > 0){
        this.setState({inChance: e.target.value})
    }
    else if(e.target.value > 1) {
      this.setState({inChance: 1.0})
    }
    else {
      this.setState({inChance: 0})
    }
    
  }
  changeRecChance(e) {
    if(e.target.value <= 1 && e.target.value > 0){
      this.setState({recChance: e.target.value})
    }
    else if(e.target.value > 1) {
      this.setState({recChance: 1.0})
    }
    else {
      this.setState({recChance: 0})
    }
  }
  changeSimSpeed(e) {
    if( e.target.value > 0){
      this.setState({simSpeed: e.target.value})
    }
    else {
      this.setState({simSpeed: 1})
    }
  }
  render() {
     const ref = this;
          // graph event callbacks
      const onClickGraph = function() {
        console.log(`Clicked the graph background`);
      };

      const onClickNode = function(nodeId) {
        let modData = { ...ref.state.data };
        if(dblNode !== null) {
            let dat = ref.state.data
            dat.links.push({
              source: dblNode,
              target: nodeId,
            });
            let modData = { ...ref.state.data };
            let selectNode = modData.nodes.filter(item => {
              return item.id === dblNode;
            });
            selectNode.forEach(item => {
                item.color = prevCol
            });
            ref.setState({ data: modData });
            dblNode = null;
            ref.setState({
              data: dat
            });
          }
        else {
        let selectNode = modData.nodes.filter(item => {
          return item.id === nodeId;
        });
        selectNode.forEach(item => {
          console.log(item.color)
          if(item.color === "LightCoral"){
            item.color = "MediumAquaMarine";
            ref.setState({ LightCoralNodes: ref.state.LightCoralNodes-1 });
            ref.setState({ MediumAquaMarineNodes: ref.state.MediumAquaMarineNodes+1 });
          }
          else if(item.color === "MediumAquaMarine"){
            item.color = susCol;
            ref.setState({ MediumAquaMarineNodes: ref.state.MediumAquaMarineNodes-1 });
            ref.setState({ susNodes: ref.state.susNodes+1 });
          }
          
          else {
            item.color = "LightCoral"
            ref.setState({ susNodes: ref.state.susNodes-1 });
            ref.setState({ LightCoralNodes: ref.state.LightCoralNodes+1 });
          }
 
        });
        ref.setState({ data: modData });
      }
      };

      const onDoubleClickNode = function(nodeId) {
        if(dblNode == null) {
          dblNode = nodeId;
          let modData = { ...ref.state.data };
          let selectNode = modData.nodes.filter(item => {
            return item.id === nodeId;
          });
          selectNode.forEach(item => {
              prevCol = item.color;
              item.color = "purple";
          });
          ref.setState({ data: modData });
        }
        else {
          let dat = ref.state.data
          dat.links.push({
            source: dblNode,
            target: nodeId,
          });
          let modData = { ...ref.state.data };
          let selectNode = modData.nodes.filter(item => {
            return item.id === dblNode;
          });
          selectNode.forEach(item => {
              item.color = prevCol
          });
          ref.setState({ data: modData });
          dblNode = null;
          ref.setState({
            data: dat
          });
      }
      };

      const onRightClickNode = function(event, nodeId) {
        event.preventDefault();
        let array = { ...ref.state.data}
        let el = array.links.filter(item => {
          return item.source !== nodeId && item.target !== nodeId;
         });
         array.links = el;
        ref.setState({
          data: array,
        });
      };

      const onMouseOverNode = function(nodeId) {
        //console.log(`Mouse over node ${nodeId}`);
      };

      const onMouseOutNode = function(nodeId) {
        //console.log(`Mouse out node ${nodeId}`);
      };

      const onClickLink = function(source, target) {
        let array = { ...ref.state.data}
        let el = array.links.filter(item => {
          return item.source !== source || item.target !== target;
         });
         array.links = el;
        ref.setState({
          data: array,
        });
      };

      const onRightClickLink = function(event, source, target) {

      };

      const onMouseOverLink = function(source, target) {
       //console.log(`Mouse over in link between ${source} and ${target}`);
      };

      const onMouseOutLink = function(source, target) {
        //console.log(`Mouse out link between ${source} and ${target}`);
      };

      const onNodePositionChange = function(nodeId, x, y) {
        //console.log(`Node ${nodeId} is moved to new position. New position is x= ${x} y= ${y}`);
      };
      

      const onClickAddNode = function() {
        if (ref.state.data.nodes && ref.state.data.nodes.length) {
          const maxIndex = ref.state.data.nodes.length - 1;
          const minIndex = 0;
    
          let i = Math.floor(Math.random() * (maxIndex - minIndex + 1) + minIndex),
            nLinks = Math.floor(Math.random() * (5 - minIndex + 1) + minIndex);
          const newNode = `${ref.state.data.nodes.length}`;
    
          ref.state.data.nodes.push({ id: newNode });
    
          while (ref.state.data.nodes[i] && ref.state.data.nodes[i].id && nLinks) {
            ref.state.data.links.push({
              source: newNode,
              target: ref.state.data.nodes[i].id,
            });
    
            i++;
            nLinks--;
          }
    
          ref.setState({
            data: ref.state.data,
          });
        } else {
          // 1st node
          const data = {
            nodes: [{ id: "Node 1" }],
            links: [],
          };
    
          ref.setState({ data });
          
        }
        ref.setState({ susNodes: ref.state.data.nodes.length-ref.state.LightCoralNodes-ref.state.MediumAquaMarineNodes });
      };

      const simStep = function() {
            let selectNode = ref.state.data.nodes.filter(item => {
              return item.color === "LightCoral";
            });
            let nodeIds = []
            selectNode.forEach(item => {
              nodeIds.push(item.id);
          });

            let vulnerable = []
            ref.state.data.links.forEach(item => {
              if(nodeIds.indexOf(item.source) > -1) {
                vulnerable.push(item.target)
              }
              if(nodeIds.indexOf(item.target) > -1) {
                vulnerable.push(item.source)
              }
          });
          let modData = { ...ref.state.data };
          let nodePicks = modData.nodes.filter(item => {
            return vulnerable.indexOf(item.id) > -1 && item.color !== "LightCoral";
          });
          let recPicks = modData.nodes.filter(item => {
            return item.color === "LightCoral";
          });

          nodePicks.forEach(item => {
            if(Math.random() > 1-ref.state.inChance && item.color!=="MediumAquaMarine"){
                item.color = "LightCoral";
              }
          });
          recPicks.forEach(item => {
            if(Math.random() > 1-ref.state.recChance && item.color === "LightCoral"){
              item.color = "MediumAquaMarine";
            }
          });
          ref.setState({ data: modData });
          let rNum = 0
          let gNum = 0
          let susNum = 0
          ref.state.data.nodes.forEach(item => {
            if(item.color === "LightCoral"){
              rNum=rNum+1;
            }
            else if(item.color === "MediumAquaMarine"){
              gNum=gNum+1;
            }
            else {
              susNum=susNum+1;
            }
        });
        console.log(rNum)
        ref.setState({ LightCoralNodes: rNum });
        ref.setState({ MediumAquaMarineNodes: gNum });
        ref.setState({ susNodes: susNum });
        

        ref.setState({xVal: ref.state.xVal+1})
        let newlines = ref.state.linedata;
        newlines[0].values.push({x: ref.state.xVal+1, y: susNum})
        newlines[1].values.push({x: ref.state.xVal+1, y: rNum})
        newlines[2].values.push({x: ref.state.xVal+1, y: gNum})
        ref.setState({linedata: newlines})
        
        console.log(newlines)
          
      }
      const onClickRemoveNode  = function() {
        if (ref.state.data.nodes && ref.state.data.nodes.length > 1) {
          const id = ref.state.data.nodes[0].id;
    
          ref.state.data.nodes.splice(0, 1);
          const links = ref.state.data.links.filter(l => l.source !== id && l.target !== id);
          const data = { nodes: ref.state.data.nodes, links };
    
          ref.setState({ data });
        } else {
          console.log("Need to have at least one node!");
        }
        ref.setState({ susNodes: ref.state.data.nodes.length-ref.state.LightCoralNodes-ref.state.MediumAquaMarineNodes-1 });
      }
      const restartSimulation  = function() {
        pause()
        let modData = { ...ref.state.data };
        modData.nodes.forEach(item => {
            item.color = susCol;
            if(item.id === "G"){
              item.color = "LightCoral"
            }
        });
        ref.setState({ data: modData });
        ref.setState({xVal: 0})
        ref.setState({ linedata: [
          {
          label: 'Susceptible',
          values: [{x: 0, y: 0}]
          },
          {
          label: 'Infected',
          values: [{x: 0, y: 0}]
          },
          {
          label: 'Recovered',
          values: [{x: 0, y: 0}]
          }
      ] });
        ref.setState({ LightCoralNodes: 1 });
        ref.setState({ MediumAquaMarineNodes: 0 });
        ref.setState({ susNodes: ref.state.data.nodes.length-1 });
      };
      const play = () => {
        let intervalId = setInterval(simStep, ref.state.simSpeed)
        this.setState({ intervalId: intervalId })
      }
      const pause = () => {
        clearInterval(this.state.intervalId)
      }
      const tooltipLine = function(label, data) {
        return label;
    }
    const colorLine = function(label, data) {
      if(label === 'Susceptible'){
        return "DarkKhaki"
      }
      if(label === 'Infected'){
        return "LightCoral"
      }
      return "MediumAquaMarine";
  }
  return (
    <div className="App">
      <div className = "one">
          <button onClick={onClickAddNode}>
              +
            </button>
            
            <button onClick={onClickRemoveNode}>
              -
            </button>
            <br></br>
          <button onClick={simStep}>Step Forward</button>
          <br></br>
          <button onClick={restartSimulation}>Restart Simulation</button>
          <br></br>
          Infection Chance: <input
                name="inChance"
                type="number"
                value={this.state.inChance}
                onChange={this.changeInChance} />
          <br></br>
          Recovery Chance: <input
              name="recChance"
              type="number"
              value={this.state.recChance}
              onChange={this.changeRecChance} />
              <br></br>
          <button onClick={play}>Play</button>
          <button onClick={pause}>Pause</button>
          <br></br>
          Sim Delay: <input
              name="simSpeed"
              type="number"
              value={this.state.simSpeed}
              onChange={this.changeSimSpeed} />
              <br></br>
          <br></br>
          <div>Susceptible: {this.state.susNodes}</div>
          <div>Infected: {this.state.LightCoralNodes}</div>
          <div>Recovered: {this.state.MediumAquaMarineNodes}</div>
          <LineChart
                data={this.state.linedata}
                width={400}
                colorScale = { colorLine }
                tooltipHtml={tooltipLine}
                height={400}
                margin={{top: 10, bottom: 50, left: 50, right: 10}}/>
        </div>
        <div className="two">
          <Graph
              id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
              data={this.state.data}
              config={myConfig}
              onClickNode={onClickNode}
              onDoubleClickNode={onDoubleClickNode}
              onRightClickNode={onRightClickNode}
              onClickGraph={onClickGraph}
              onClickLink={onClickLink}
              onRightClickLink={onRightClickLink}
              onMouseOverNode={onMouseOverNode}
              onMouseOutNode={onMouseOutNode}
              onMouseOverLink={onMouseOverLink}
              onMouseOutLink={onMouseOutLink}
              onNodePositionChange={onNodePositionChange}
            />
        </div>
        
    </div>
  );
}
}

export default App;
