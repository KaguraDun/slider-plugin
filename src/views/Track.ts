import createElement from '../helpers/createElement';

class Track {
  parent: HTMLElement;

  constructor(parent: HTMLElement) {
    this.parent = parent;
  }

  render() {
    const track = createElement('div', 'track');
    this.parent.append(track);
    return track;
  }
}

export default Track;
