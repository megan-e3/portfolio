import { fetchJSON, renderProjects, fetchGitHubData } from './global.js';

const projects = await fetchJSON('./lib/projects.json');
const latestProjects = projects.slice(0, 3);
const projectsContainer = document.querySelector('.projects');

renderProjects(latestProjects, projectsContainer, 'h2');

const githubData = await fetchGitHubData('megan-e3');
const profileStats = document.querySelector('#profile-stats');

if (profileStats && githubData) {
  profileStats.innerHTML = `
        <h2>My GitHub Stats</h2>
        <dl class="stats-grid">
          <dt>USER TYPE</dt><dd>${githubData.user_view_type.toUpperCase()}</dd>
          <dt>REPOS</dt><dd>${githubData.public_repos}</dd>
          <dt>FOLLOWERS</dt><dd>${githubData.followers}</dd>
          <dt>ACCOUNT CREATED</dt><dd>${githubData.created_at.split('T')[0]}</dd>
        </dl>
    `;
}