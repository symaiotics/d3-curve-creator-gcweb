<template>
 
    <div class="row">
      <div class="col">
        <h1>
          {{ title }}
          <small>{{ description }}</small>
        </h1>
      </div>
        <div class="col">
        <!-- <span  class="glyphicon glyphicon-plus d3CurveCreatorMenuIcon"></span> -->
        <!-- <span
          @click="deleteSelectedNode()"
          class="d3CurveCreatorMenuIcon glyphicon glyphicon-minus"
        ></span>
        <span @click="toggleFixed()" class="d3CurveCreatorMenuIcon glyphicon glyphicon-pushpin"></span>
        <span @click="addLink()" class="d3CurveCreatorMenuIcon glyphicon glyphicon-link"></span>
        <span
          @click="downloadSvg(parentId)"
          class="d3CurveCreatorMenuIcon glyphicon glyphicon-picture"
        ></span>
        <span
          @click="downloadJson(dataset)"
          class="d3CurveCreatorMenuIcon glyphicon glyphicon-download"
        ></span> -->
      </div> 
    </div>
 

<div  :id="parentId" style="min-height:400px"></div>
	<div class="form-group">
		<label class="form-label">Curve Type ({{ curveType }})</label>
		<select
			@change="updateAll"
			v-model="curveType"
			class="form-control"
		>
			<option value="flat">Flat</option>
			<!-- <option value ='linearDown'>Linear Down</option> -->
			<option value="sigmoid">Sigmoid</option>
			<option value="bell">Bell</option>
			<option value="parabola">Parabola</option>
			<option value="sine">Sine</option>
			<option value="fallingSine">Falling Sine</option>
			<option value="fallingSineFlipped">Falling Sine (Flipped)</option>
			<option value="growingSine">Growing Sine</option>
		</select>
	</div>

	<!-- <div class="form-group">
		<label class="form-label">Category ({{ category }})</label>
		<select
			@change="updateAll"
			v-model="category"
			class="form-control"
		>
			<option value="focus">Focus</option>
			<option value="positivity">Positivity</option>
		</select>
	</div> -->

	<!-- 			
<label>
	Zoom
	<input @input="updateAll" v-model="val" type="range" min=".5" max="20" step="0.1" />
	</label>	
	-->

	<div class="form-group text-left">
		<label class="form-label inline-block mb-2 text-gray-700">Shift ({{ shift }})</label>
		<input
			@input="updateAll"
			v-model="shift"
			type="range"
			min="-5"
			max="5"
			step="0.01"
			class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
		/>
	</div>

	<div class="form-group text-left">
		<label class="form-label inline-block mb-2 text-gray-700">Clip Left ({{ clipLeft }})</label>
		<input
			@input="updateAll"
			v-model="clipLeft"
			type="range"
			min="0"
			max="8"
			step="0.1"
			class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
		/>
	</div>

	<div class="form-group text-left">
		<label class="form-label inline-block mb-2 text-gray-700">Clip Right ({{ clipRight }})</label>
		<input
			@input="updateAll"
			v-model="clipRight"
			type="range"
			min="0"
			max="8"
			step="0.1"
			class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
		/>
	</div>

	<div class="form-group text-left">
		<label class="form-label inline-block mb-2 text-gray-700">Resolution ({{ resolution }})</label>
		<input
			@input="updateAll"
			v-model="resolution"
			type="range"
			min="1"
			max="100"
			step="1"
			class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
		/>
	</div>

	<table class="text-left gc-table table provisional" style = "width:100%">
		<thead>
			<tr>
			<th>Index</th>
			<th>Domain X (shifted)</th>
			<th>X</th>
			<th>Y</th>
			</tr>
		</thead>
		<tbody>
		<tr v-for="sigmoid in sigmoidData">
			<td>{{ sigmoid.index }}</td>
			<td>{{ sigmoid.domainX.toFixed(6) }}</td>
			<td>{{ sigmoid.x.toFixed(6) }}</td>
			<td>{{ sigmoid.y.toFixed(6) }}</td>
		</tr>
		</tbody>
	</table>

 

</template>

<script setup>
// import * as d3 from 'd3';
import { v4 as uuidv4 } from 'uuid';
import { ref, onMounted, onBeforeMount } from 'vue';

//These emits all send up to a parent node, if required
let emit = defineEmits([
  'curveUpdated', //active nodes 
])

//These props allow us to customize the 
let props = defineProps({
	d3: { type: Object},
  title: { type: String, default: "D3 Curve Creator" },
  description: { type: String, default: "Interface Description" },
})

var width = 1, height = 1;
let parentId = ref('')
let svg = null;

const FONT_SIZE = 12
const margin = { top: 10, right: 30, bottom: 30, left: 30 }

var axisX, axisY, path,
	labels, data = null;

let shift = ref(0);
let clipLeft = ref(0);
let clipRight = ref(0);
let resolution = ref(100);
let curveType = ref('sigmoid');
// let category = ref('positivity');
let sigmoidData = ref([]);

onBeforeMount(() => {
  parentId.value = uuidv4();
});

onMounted(() => {
  initialize()
});


function updateAll() {
	update();
}


function initialize() {

	var parentDiv = document.getElementById(parentId.value);
	width = parentDiv.clientWidth - margin.left - margin.right;
	height = parentDiv.clientHeight - margin.top - margin.bottom;

	svg = props.d3.select(parentDiv).append("svg");
	svg.attr("width", width)
		.attr("height", height)
		.attr("class", "w-full sm:h-64 mx-auto border-solid border-2 border-indigo-600 rounded-md")
		.attr("style", "min-height:400px");

	svg = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

	axisX = svg.append('g')
		.attr('class', 'axis axis--x')

	axisY = svg.append('g')
		.attr('class', 'axis axis--y')

	path = svg.append('path')
		.attr('class', 'sigmoid')

	// dots = svg.append('g')
	// 	.attr('class', 'dots')

	labels = svg.append('g')
		.attr('class', 'labels')

	// labels.append('text')
	// 	.attr('class', 'label label--c')
	// 	.text('Complaints')

	// labels.append('text')
	// 	.attr('class', 'label label--n')
	// 	.text('Not complaints')

	labels.selectAll('text')
		.attr('text-anchor', 'middle')

	update()

}

function generateCurve(startX, endX, xFactor, step) {
	var sigs = [];
	var index = 0;
	var cumulative = 0;

	function randomNumber(min, max) {
		return Math.floor(Math.random() * (max - min) + min);
	}

	for (var a = 0; a < step; a++) {
		
		var t = (startX + ((endX - startX) / (step) * (a)))
		var sig =
		{
			index: index,
			y: .5, //Level
			x: t ,//
			domainX: t  +parseFloat(shift.value),
		}

		if (curveType.value == 'sigmoid') sig.y = (1 / (1 + Math.exp(-2 * t))); //Sigmoid
		if (curveType.value == 'bell') sig.y = (1 / (Math.exp(Math.pow(t, 2)))); //Bell
		if (curveType.value == 'parabola') sig.y = Math.pow(-2 * t, 2); //Parabola
		if (curveType.value == 'sine') sig.y = .5 + Math.sin(t*2) * .5  //Sine
		if (curveType.value == 'fallingSine') sig.y = .5 + (Math.sin(t) / (step / (step - a)) * .5) //Parabola
		if (curveType.value == 'fallingSineFlipped') sig.y = .5 + (Math.sin(t) / (step / (a - step)) * .5) //Parabola
		if (curveType.value == 'growingSine') sig.y = .5 + (Math.sin(t) / (step / a + .01)) * .5 //Parabola

		// Add Randomization
		// sig.y = sig.y + randomNumber(-100,100)/10000

		index++;
		sigs.push(sig)
	}

	return sigs;
}


function update() {

	//Trimmed Curve
	// var sX = -1 + parseFloat(clipLeft.value);
	// var sY = 1 - parseFloat(clipRight.value);

	//Zoomed Curve	
	var sX = -5 + parseFloat(clipLeft.value) ;
	var sY = 5 - parseFloat(clipRight.value) ;
	sigmoidData.value = generateCurve(sX , sY, 1, parseInt(resolution.value));

	//Trimmed Curve
	// const scaleX = d3.scaleLinear().domain([-5, 5]).range([0, width])
	const scaleX = props.d3.scaleLinear().domain([sX + parseFloat(shift.value), sY + parseFloat(shift.value)]).range([0, width])

	//Zoomed Curve
	// const scaleX = d3.scaleLinear().domain([-limit, limit]).range([0, width])
	const scaleXAxis = props.d3.scaleLinear().domain([-5, 5]).range([0, width])
	const scaleY = props.d3.scaleLinear().domain([0, 1]).range([height, 0])

	//Lock it to the Range 5, -5


	//

	// //No Shifting
	const scaledSigmoid = props.d3.scaleLinear().domain([sigmoidData.value[0].x, sigmoidData.value[sigmoidData.value.length-1].x]).range([-5, 5])
	for(var a = 0; a< sigmoidData.value.length;a++)
	{sigmoidData.value[a].x = scaledSigmoid(sigmoidData.value[a].x )}

	// for(var a = 0; a< sigmoidData.value.length;a++)
	// {
	// 	if(sigmoidData.value[a].domainX < -5 || sigmoidData.value[a].domainX > 5 ) sigmoidData.value[a].y=0
	// }
	// for(var a = 0; a< sigmoidData.value.length;a++)
	// {
	// 	sigmoidData.value[a].x += parseFloat(shift.value)
	// }

	//Emit the new curve values
	emit("curveUpdated", sigmoidData.value)

	const sLine = props.d3.line()
		.x((d, i) => scaleX(d.x))
		.y((d, i) => scaleY(d.y))

	var groundedLine = JSON.parse(JSON.stringify(sigmoidData.value))
	groundedLine.unshift({ x: groundedLine[0].x, y: 0 })
	groundedLine.push({ x: groundedLine[groundedLine.length - 1].x, y: 0 })
	groundedLine.push({ x: groundedLine[0].x, y: 0 })

	path
		.datum(groundedLine)
		.attr('d', sLine)
		.attr('stroke', "#339")
		.attr('stroke-width', "2")
		.attr('fill', '#055Baa44')

	//Chart Axis
	const x = props.d3.axisBottom(scaleXAxis)

	axisX.call(x)
		.attr('transform', `translate(0,${height})`)

	const y = props.d3.axisLeft(scaleY)

	axisY.call(y)
		.attr('transform', `translate(${width / 2}, 0)`)

	svg.select('.label--c')
		.attr('x', width / 2)
		.attr('y', FONT_SIZE * 2)

	svg.select('.label--n')
		.attr('x', width / 2)
		.attr('y', height - FONT_SIZE * 1)
}



</script>
 
<!-- Important to ensure your styles are scoped for your components to not interfere with global styling -->
<style scoped>
.d3CurveCreatorSvgParent {
  height: 500px;
  min-height: 500px;
  border-radius: 5px;
  border-width: 3px;
  border-color: grey;
  border-style: solid;
}

.d3CurveCreatorMenu {
  height: 40px;
}
.d3CurveCreatorMenuIcon {
  font-size: 1.5em;
  padding: 5px;
  height: 20px;
  margin-top: auto;
  margin-bottom: auto;
}

.d3CurveCreatorMenuIcon:hover {
  opacity: 0.8;
}
</style> 
