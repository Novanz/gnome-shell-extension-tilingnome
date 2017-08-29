const Meta = imports.gi.Meta;

function horizontal(settings, wins, area) {
  const sr = settings.get_double('split-ratio');
  const mc = Math.min(settings.get_uint('master-count'), wins.length - 1);
  return wins.slice(0, mc).map((_, i, part) => new Meta.Rectangle({
    x:      area.x,
    y:      area.y + (i * area.height / part.length),
    width:  area.width * sr,
    height: area.height / part.length
  })).concat(wins.slice(mc).map((_, i, part) => new Meta.Rectangle({
    x:      area.x + area.width * sr,
    y:      area.y + (i * area.height / part.length),
    width:  area.width * (1 - sr),
    height: area.height / part.length
  })));
}

function vertical(settings, wins, area) {
  const sr = settings.get_double('split-ratio');
  const mc = Math.min(settings.get_uint('master-count'), wins.length - 1);
  return wins.slice(0, mc).map((_, i, part) => new Meta.Rectangle({
    x:      area.x + (i * area.width / part.length),
    y:      area.y,
    width:  area.width / part.length,
    height: area.height * sr
  })).concat(wins.slice(mc).map((_, i, part) => new Meta.Rectangle({
    x:      area.x + (i * area.width / part.length),
    y:      area.y + area.width * sr,
    width:  area.width / part.length,
    height: area.height * (1 - sr)
  })));
}
