
import './simStyle.css';
import { Graph } from "react-d3-graph";
import React, { Component } from "react";
import config from "./config.js"
import airport from "./airport.js"
//import slowburn form "./slowburn.js"
import linedata from "./linedata.js"
import {LineChart} from 'react-d3-components';

var dat = airport
var dblNode = null;
var susCol = "DarkKhaki";
var prevCol =  susCol;
class Simulation extends Component {
  constructor() {
    super();
    
    this.state = {
      data: dat,
      recChance: 0.9,
      inChance: 0.6,
      intervalId: null,
      LightCoralNodes: 0,
      MediumAquaMarineNodes: 0,
      susNodes: 100,
      simSpeed: 1000,
      linedata: linedata,
      xVal: 0,
      myConfig: config,
      
    };
    this.changeInChance = this.changeInChance.bind(this)
    this.changeRecChance = this.changeRecChance.bind(this)
    this.changeSimSpeed = this.changeSimSpeed.bind(this)
  }
  changeInChance(e) {
        this.setState({inChance: e.target.value/100})
    
  }
  changeRecChance(e) {
      this.setState({recChance: e.target.value/100})
  }
  changeSimSpeed(e) {
    if( e.target.value > 0){
      this.setState({simSpeed: e.target.value})
    }
    else {
      this.setState({simSpeed: 1})
    }
  }
  
  componentDidMount() {
    setTimeout(() => {  
      let modConfig = {...this.state.myConfig}
    modConfig["staticGraphWithDragAndDrop"]=true;
    this.setState({myConfig: modConfig})
  }, 9000);
  }
  render() {
     const ref = this;
          // graph event callbacks
      const onClickGraph = function() {
        let modData = { ...ref.state.data };
        let selectNode = modData.nodes.filter(item => {
          return item.id === dblNode;
        });
        selectNode.forEach(item => {
            item.color = prevCol
        });
        ref.setState({ data: modData });
        dblNode = null;
      };
      const deleteNode = function() {
        if (ref.state.data.nodes && ref.state.data.nodes.length > 1) {
          const id = dblNode;
          const nodes = ref.state.data.nodes.filter(item => {
            return item.id !== id;
          });
          
          const links = ref.state.data.links.filter(l => l.source !== id && l.target !== id);
          console.log(links)
          const data = { nodes, links };
    
          ref.setState({ data });
        }
        ref.setState({ susNodes: ref.state.data.nodes.length-ref.state.LightCoralNodes-ref.state.MediumAquaMarineNodes-1 });
        dblNode = null;
      }
      const onClickNode = function(nodeId) {
        let modData = { ...ref.state.data };
        if(dblNode !== null) {
            let dat = ref.state.data
            if(nodeId !== dblNode){
            dat.links.push({
                source: dblNode,
                target: nodeId,
              });
            }
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
        if(dblNode !== null) {
            let dat = ref.state.data
            dat.links.push({
              source: dblNode,
              target: nodeId,
            });
            let modData = { ...ref.state.data };
            
            ref.setState({
              data: dat
            });
          }
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
        let modConfig = {...ref.state.myConfig}
          modConfig["staticGraphWithDragAndDrop"]=false;
          ref.setState({myConfig: modConfig})

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
        setTimeout(() => {  
          let modConfig = {...ref.state.myConfig}
          modConfig["staticGraphWithDragAndDrop"]=true;
          ref.setState({myConfig: modConfig})}, 9000);
      };

      const simStep = function() {
        if(ref.state.LightCoralNodes !== 0){
            let selectNode = ref.state.data.nodes.filter(item => {
              return item.color === "LightCoral";
            });
            let nodeIds = []
            selectNode.forEach(item => {
              nodeIds.push(item.id);
          });

            let vulnerable = []
            let vulnlinks = {};
            ref.state.data.links.forEach(item => {
              if(nodeIds.indexOf(item.source) > -1) {
                vulnerable.push(item.target)
                vulnlinks[item.target]=item
              }
              if(nodeIds.indexOf(item.target) > -1) {
                vulnerable.push(item.source)
                vulnlinks[item.source]=item
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
                vulnlinks[item.id].color="LightCoral"
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
        ref.setState({ LightCoralNodes: rNum });
        ref.setState({ MediumAquaMarineNodes: gNum });
        ref.setState({ susNodes: susNum });
        

        ref.setState({xVal: ref.state.xVal+1})
        let newlines = ref.state.linedata;
        newlines[0].values.push({x: ref.state.xVal+1, y: susNum})
        newlines[1].values.push({x: ref.state.xVal+1, y: rNum})
        newlines[2].values.push({x: ref.state.xVal+1, y: gNum})
        ref.setState({linedata: newlines})
      }
        
          
      }
      const onClickRemoveNode  = function() {
        if (ref.state.data.nodes && ref.state.data.nodes.length > 1) {
          const id = ref.state.data.nodes[0].id;
    
          ref.state.data.nodes.splice(0, 1);
          const links = ref.state.data.links.filter(l => l.source !== id && l.target !== id);
          const data = { nodes: ref.state.data.nodes, links };
    
          ref.setState({ data });
        }
        ref.setState({ susNodes: ref.state.data.nodes.length-ref.state.LightCoralNodes-ref.state.MediumAquaMarineNodes-1 });
      }
      const restartSimulation  = function() {
        pause()
        let modData = { ...ref.state.data };
        modData.nodes.forEach(item => {
            item.color = susCol;
        });
        modData.links.forEach(item => {
          item.color = "#d3d3d3";
      });
        ref.setState({ data: modData });
        ref.setState({xVal: 0})
        ref.setState({ linedata: [
          {
          label: 'Susceptible',
          values: [{x: 0.1, y: 100}]
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
      ref.setState({ LightCoralNodes: rNum });
      ref.setState({ MediumAquaMarineNodes: gNum });
      ref.setState({ susNodes: susNum });
       
      };
      const play = () => {
        let intervalId = setInterval(simStep, ref.state.simSpeed)
        this.setState({ intervalId: intervalId })
      }
      const pause = () => {
        clearInterval(this.state.intervalId)
        
      }
      const oneStep = () => {
        simStep()
        
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
    <div className="App" style={{fontSize: "small"}}>
      <div className = "one" style={{height: window.innerHeight/2, width: window.innerWidth/5}}>
      <div className = "ones" style={{height: window.innerHeight/2, width: window.innerWidth/5}}>
      <div className = "buttons"style={{height: window.innerHeight/2, width: window.innerWidth/5}}>
          <div><button className = "circleButton" onClick={onClickAddNode}>
              +
            </button>
            <button className = "circleButton" onClick={onClickRemoveNode}>
              -
            </button>
          <button className = "homeButton" onClick={deleteNode}>Delete Node</button></div>
            
          <div><button className = "homeButton" onClick={oneStep}>Step Forward</button>
          
          <button className = "homeButton" onClick={restartSimulation}>Reset</button></div>
          
          <div style={{fontSize: "small"}}>Infection Chance: <input
                name="inChance"
                type="range"
                min="1"
                max="100"
                value={this.state.inChance*100}
                onChange={this.changeInChance} />{
                  parseInt(this.state.inChance*100)}%</div>
          
          <div style={{fontSize: "small"}}>Recovery Chance: <input
              name="recChance"
              type="range"
              min="1"
              max="100"
              value={this.state.recChance*100}
              onChange={this.changeRecChance} />{
                parseInt(this.state.recChance*100)}%</div>
              
              
          <div> <button className = "homeButton" onClick={play}>Play</button>
          <button className = "homeButton" onClick={pause}>Pause</button></div>
          
          Speed of Simulation: 
          
          fast<input
              name="simSpeed"
              type="range"
              min="1"
              max="1000"
              value={this.state.simSpeed}
              onChange={this.changeSimSpeed} />slow
              
          
          <div><span className = "circle3"></span>Susceptible: {this.state.susNodes}</div>
          <div><span className = "circle1"></span> Infected: {this.state.LightCoralNodes}</div>
          <div><span className = "circle2"></span>Recovered: {this.state.MediumAquaMarineNodes}</div>
          </div>
          
          </div>
          
          </div>
          <div></div>
          <div className="two" style={{height: window.innerHeight/2, width: window.innerWidth/1.46}}>
          <Graph
              id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
              data={this.state.data}
              config={this.state.myConfig}
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
          
        

        
          
        <div className="graph" style={{ width: window.innerWidth/1.09}}>
          <LineChart
                data={this.state.linedata}
                width={window.innerWidth/1.1}
                colorScale = { colorLine }
                tooltipHtml={tooltipLine}
                height={400}
                strokeDasharray="3 3"
                margin={{top: 10, bottom: 50, left: 50, right: 10}}/>
          </div>
          
    </div>
  );
}
}

export default Simulation;
