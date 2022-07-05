const {
  existsLaunchWithId,
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunchbyId,
} = require('../../models/launches.model');
const { getPagination } = require('../../services/query');

async function httpGetAllLaunches(req, res) {
  const { skip, limit } = getPagination(req.query);
  const launches = await getAllLaunches(skip, limit);

  res.status(200).json(launches);
}

async function httpAddNewLaunch(req, res) {
  const launch = req.body;

  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({ error: 'Missing required launch property' });
  }

  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({ error: 'Invalid launch date' });
  }

  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({ error: 'Missing required launch property' });
  }

  const newLaunch = await scheduleNewLaunch(launch);
  return res.status(201).json(newLaunch);
}

async function httpAbortLaunch(req, res) {
  const launchId = +req.params.id;

  if (await existsLaunchWithId(launchId)) {
    const aborted = abortLaunchbyId(launchId);

    if (!aborted) {
      return res.status(400).json({ error: 'Launch not aborted' });
    }
    return res.status(200).json({ ok: true });
  }

  return res.status(400).json({ error: 'Launch not found' });
}

module.exports = { httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch };
