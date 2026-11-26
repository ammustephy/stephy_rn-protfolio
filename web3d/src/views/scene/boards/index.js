import * as THREE from 'three';
import { BACK } from '../layout.js';
import { buildPoster } from './poster.js';
import { buildAboutBoard } from './aboutBoard.js';
import { buildSkillsBoard } from './skillsBoard.js';
import { buildCorkBoard } from './corkBoard.js';
import { buildProjectsWall } from './projectsWall.js';
import { buildCertificates } from './certificates.js';
import { buildScreens } from './screens.js';
import { anchor, disposeGroup } from './common.js';

/**
 * Builds every content board for one layout ('wide' or 'narrow').
 * Returns the anchors the camera frames for each stop, and the clickable objects.
 * Called again (after dispose) when the screen switches between landscape and portrait.
 */
export function buildBoards(parent, L, content, ctx) {
  const group = new THREE.Group(); group.name = 'boards'; parent.add(group);
  const poster = buildPoster(group, L, content.profile);
  const about = buildAboutBoard(group, L, content.profile);
  const skills = buildSkillsBoard(group, L, content.skillGroups);
  const cork = buildCorkBoard(group, L, content.jobs);
  const projects = buildProjectsWall(group, L, content.projects, ctx.images, ctx.desk.monitorScreen);
  const certs = buildCertificates(group, L, content.education);
  const screens = buildScreens(L, content.profile, ctx.desk.laptopScreen, ctx.desk.phoneScreen);

  const narrow = L.mode === 'narrow';
  const anchors = {
    // wide: the back wall from the about board's edge to the poster; narrow: the poster alone
    home: narrow ? poster.anchor : anchor(new THREE.Vector3(2.0, 1.62, BACK), new THREE.Vector3(0, 0, 1), [6.3, 2.7]),
    poster: poster.anchor,
    about: about.anchor,
    skills: skills.anchor,
    experience: cork.anchor,
    projects: projects.anchor,
    education: certs.anchor,
    contact: screens.anchor,
  };

  return {
    group,
    anchors,
    screens,
    clickables: [...cork.clickables, ...projects.clickables, ...screens.clickables],
    dispose() {
      parent.remove(group);
      disposeGroup(group);
    },
  };
}
