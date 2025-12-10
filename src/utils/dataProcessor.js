import Papa from 'papaparse';
import { format, getHours, getDay, parseISO, isValid } from 'date-fns';

export const parseCSV = async (filePath) => {
    return new Promise((resolve, reject) => {
        Papa.parse(filePath, {
            download: true,
            header: true,
            complete: (results) => {
                resolve(processData(results.data));
            },
            error: (error) => {
                reject(error);
            }
        });
    });
};

const processData = (rawData) => {
    // Filter out empty rows or rows without proper timestamp
    const validData = rawData.filter(row => row['Date#IndoCurry']);

    const totalScrobbles = validData.length;
    // Initialize aggregates
    const artists = {}; // { name: count }
    const artistDetails = {}; // { name: { count, firstListen, lastListen, tracks: {} } }
    const tracks = {};
    const scrobblesByYear = {};
    const scrobblesByHourDay = Array(7).fill(0).map(() => Array(24).fill(0));
    const dailyActivity = {}; // "YYYY-MM-DD": count

    // Milestones & Streaks calculation
    // Create a copy for sorting oldest -> newest
    const sortedData = [...validData].sort((a, b) => parseInt(a['Date#IndoCurry']) - parseInt(b['Date#IndoCurry']));

    const milestones = [];
    let currentStreak = 0;
    let maxStreak = 0;

    sortedData.forEach((row, index) => {
        const artistName = row['Artist'] || 'Unknown Artist';
        const trackName = row['Track'] || 'Unknown Track';
        const albumName = row['Album'];
        const timestampStr = row['Date#IndoCurry'];

        if (!timestampStr) return;

        const date = new Date(parseInt(timestampStr));
        if (!isValid(date)) return;

        // --- Artist Stats ---
        artists[artistName] = (artists[artistName] || 0) + 1;

        if (!artistDetails[artistName]) {
            artistDetails[artistName] = {
                name: artistName,
                count: 0,
                topTracks: {},
                topAlbums: {},
                firstListen: date, // Will be correct since sortedData is oldest first
                lastListen: date
            };
        }
        artistDetails[artistName].count++;
        artistDetails[artistName].lastListen = date; // update to latest

        // Top Tracks for Artist
        const trackKey = trackName;
        artistDetails[artistName].topTracks[trackKey] = (artistDetails[artistName].topTracks[trackKey] || 0) + 1;

        // Top Albums for Artist
        if (albumName) {
            artistDetails[artistName].topAlbums[albumName] = (artistDetails[artistName].topAlbums[albumName] || 0) + 1;
        }

        // --- Global Tracks ---
        const fullTrackName = `${trackName} - ${artistName}`;
        tracks[fullTrackName] = (tracks[fullTrackName] || 0) + 1;

        // --- Temporal Stats ---
        const year = date.getFullYear();
        scrobblesByYear[year] = (scrobblesByYear[year] || 0) + 1;

        const hour = getHours(date);
        const day = getDay(date); // 0 = Sunday
        scrobblesByHourDay[day][hour]++;

        const dayKey = format(date, 'yyyy-MM-dd');
        dailyActivity[dayKey] = (dailyActivity[dayKey] || 0) + 1;

        // --- Milestones ---
        const count = index + 1;
        if (count === 1) milestones.push({ title: 'First Scrobble', desc: `${trackName} by ${artistName}`, date, icon: 'Flag' });
        if (count % 1000 === 0) milestones.push({ title: `${count.toLocaleString()}th Scrobble`, desc: `${trackName} by ${artistName}`, date, icon: 'Award' });
        if (count === totalScrobbles) milestones.push({ title: 'Latest Scrobble', desc: `${trackName} by ${artistName}`, date, icon: 'Zap' });
    });

    // Finalize streaks logic
    const sortedDays = Object.keys(dailyActivity).sort();
    let tempStreak = 0;
    let prevDate = null;

    sortedDays.forEach(dayStr => {
        const curr = parseISO(dayStr);
        if (prevDate) {
            const diff = (curr - prevDate) / (1000 * 60 * 60 * 24);
            if (diff <= 1.5) {
                tempStreak++;
            } else {
                if (tempStreak > maxStreak) maxStreak = tempStreak;
                tempStreak = 1;
            }
        } else {
            tempStreak = 1;
        }
        prevDate = curr;
    });
    if (tempStreak > maxStreak) maxStreak = tempStreak;

    return {
        totalScrobbles,

        topArtists: Object.values(artistDetails)
            .sort((a, b) => b.count - a.count),

        topTracks: Object.entries(tracks)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count),

        years: Object.entries(scrobblesByYear)
            .map(([year, count]) => ({ year, count }))
            .sort((a, b) => a.year - b.year),

        listeningClock: scrobblesByHourDay,

        dailyActivity: Object.entries(dailyActivity)
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => new Date(a.date) - new Date(b.date)),

        milestones: milestones.reverse(),

        stats: {
            maxStreak,
            activeDays: Object.keys(dailyActivity).length,
            avgDaily: Math.round(totalScrobbles / Object.keys(dailyActivity).length || 1)
        },

        artistDetails // Passed for lookup
    };
};

export const getArtistStats = (data, artistName) => {
    if (!data || !data.artistDetails) return null;
    return data.artistDetails[artistName];
};

export const getTopArtists = (data, limit = 10) => {
    return data.topArtists.slice(0, limit);
};

export const getStatsSummary = (data) => {
    if (!data) return {};
    return {
        total: data.totalScrobbles,
        uniqueArtists: data.topArtists.length,
        uniqueTracks: data.topTracks.length,
        activeDays: data.stats.activeDays, // Use the pre-calculated one
        maxStreak: data.stats.maxStreak
    }
}
