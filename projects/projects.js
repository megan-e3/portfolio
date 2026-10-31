import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

import { fetchJSON, renderProjects } from "../global.js";

const projects = await fetchJSON("../lib/projects.json");
const projectsContainer = document.querySelector(".projects");
renderProjects(projects, projectsContainer, "h2");

const projectsTitle = document.querySelector(".projects-title");
projectsTitle.textContent = `${projects.length} Projects`;

let query = "";
let selectedIndex = -1;
let selectedYear = null;

let searchInput = document.querySelector(".searchBar");

function filterProjects(includeYear = true) {
  return projects.filter((project) => {
    let values = Object.values(project).join("\n").toLowerCase();
    let matchesQuery = values.includes(query.toLowerCase());
    let matchesYear =
      !includeYear || selectedYear === null || project.year === selectedYear;

    return matchesQuery && matchesYear;
  });
}

// Refactor all plotting into one function
function renderPieChart(projectsGiven) {
  // re-calculate rolled data
  let newRolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year,
  );
  // re-calculate data
  let newData = newRolledData.map(([year, count]) => {
    return { value: count, label: year }; // TODO
  });
  // re-calculate slice generator, arc data, arc, etc.
  let newSliceGenerator = d3.pie().value((d) => d.value);
  let newArcGenerator = d3.arc().innerRadius(0).outerRadius(50);
  let newArcData = newSliceGenerator(newData);
  let newArcs = newArcData.map((d) => newArcGenerator(d));
  let newColors = d3.scaleOrdinal(d3.schemePaired);
  // TODO: clear up paths and legends
  let newSVG = d3.select("svg");
  newSVG.selectAll("path").remove();

  let legend = d3.select(".legend");
  legend.selectAll("*").remove();
  // update paths and legends, refer to steps 1.4 and 2.2
  // newArcs.forEach((arc, idx) => {
  //   newSVG
  //     .append('path')
  //     .attr('d', arc)
  //     .attr('fill', newColors(idx));
  // });
  newArcs.forEach((arc, i) => {
    newSVG
      .append("path")
      .attr("d", arc)
      .attr("fill", newColors(i))
      .on("click", () => {
        selectedIndex = selectedIndex === i ? -1 : i;
        newSVG
          .selectAll("path")
          .attr("class", (_, idx) => (selectedIndex === idx ? "selected" : ""));
        legend
          .selectAll("li")
          .attr("class", (_, idx) =>
            selectedIndex === idx ? "legend-item selected" : "legend-item",
          );
        selectedYear =
          selectedIndex === -1 ? null : newData[selectedIndex].label;
        renderProjects(filterProjects(), projectsContainer, "h2");
        //       if (selectedIndex === -1) {
        //         renderProjects(projects, projectsContainer, "h2");
        //       } else {
        //         let selectedYear = newData[selectedIndex].label;
        //         let filteredProjects = projects.filter(
        //           (project) => project.year === selectedYear,
        //         );
        //         renderProjects(filteredProjects, projectsContainer, "h2");
        //       }
      });
  });
  newData.forEach((d, idx) => {
    legend
      .append("li")
      .attr("style", `--color:${newColors(idx)}`)
      .attr("class", "legend-item")
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
  });
}

// Call this function on page load
renderPieChart(projects);

searchInput.addEventListener("change", (event) => {
  // update query value
  query = event.target.value;
  // TODO: filter the projects
  let filteredProjects = filterProjects();
  // let filteredProjects = projects.filter((project) => {
  //   let values = Object.values(project).join("\n").toLowerCase();
  //   return values.includes(query.toLowerCase());
  // });

  // // TODO: render updated projects!
  renderProjects(filteredProjects, projectsContainer, "h2");
  renderPieChart(filterProjects(false));
  // renderPieChart(filteredProjects);
});

// let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

// let rolledData = d3.rollups(
//   projects,
//   (v) => v.length,
//   (d) => d.year,
// );

// let data = rolledData.map(([year, count]) => {
//   return { value: count, label: year };
// });

// // let arc = arcGenerator({
// //   startAngle: 0,
// //   endAngle: 2 * Math.PI,
// // });

// // d3.select('svg').append('path').attr('d', arc).attr('fill', 'red');

// // let data = [
// //   { value: 1, label: 'apples' },
// //   { value: 2, label: 'oranges' },
// //   { value: 3, label: 'mangos' },
// //   { value: 4, label: 'pears' },
// //   { value: 5, label: 'limes' },
// //   { value: 5, label: 'cherries' },
// // ];
// let sliceGenerator = d3.pie().value((d) => d.value);
// let arcData = sliceGenerator(data);
// let arcs = arcData.map((d) => arcGenerator(d));
// let colors = d3.scaleOrdinal(d3.schemePaired);
// arcs.forEach((arc, idx) => {
//   d3.select("svg").append("path").attr("d", arc).attr("fill", colors(idx));
// });

// let legend = d3.select(".legend");
// data.forEach((d, idx) => {
//   legend
//     .append("li")
//     .attr("style", `--color:${colors(idx)}`)
//     .attr("class", "legend-item")
//     .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
// });
