const { getRandomUserId, getAnotherUserId, followUser } = require("../db/dal/userQueries");
const {
    voteOnPoll,
    fetchPolls,
    likePoll,
    viewPoll,
    sharePoll,
    postNextScheduledPoll, // <-- new
} = require("../db/dal/pollQueries");

const ACTIONS = {
    VOTE: 1,
    VIEW: 2,
    FOLLOW: 3,
    POST: 4,
};

const getNextAvailablePoll = async (userId) => {
    const pollsFeed = await fetchPolls(userId);
    if (pollsFeed.length === 0) return { id: null, options: [] };
    return { id: pollsFeed[0].id, options: pollsFeed[0].options ?? [] };
};

const pickRandomAction = () => {
    // ACTIONS values are 1..4
    const values = Object.values(ACTIONS);
    const idx = Math.floor(Math.random() * values.length);
    return values[idx];
};

const chance = (p) => Math.random() < p;

const generateActivity = async () => {
    const action = pickRandomAction();

    if (action === ACTIONS.POST) {
        if (!chance(1 / 30)) return;

        const userId = await getRandomUserId("@votum.com");
        if (!userId) return;

        const result = await postNextScheduledPoll(userId, "30 days");
        if (!result) return;

        console.log(`${userId} posted scheduled poll -> ${result.pollId} (scheduled ${result.scheduledId})`);
        return;
    }

    // 2) For all other actions: keep your old skip logic (5% chance to do activity)
    if (Math.random() > 0.05) return;

    const userId = await getRandomUserId("@votum.com");
    if (!userId) return;

    const { id, options } = await getNextAvailablePoll(userId);
    if (!id || (options?.length === 0 ?? true)) return;

    switch (action) {
        default:
            return;

        case ACTIONS.VOTE: {
            const optionIndex = Math.floor(Math.random() * (options?.length ?? 1));
            const optionId = options[optionIndex].id;

            await voteOnPoll({ userId, optionId });
            console.log(`${userId} voted on poll ${id} / ${optionId}`);

            if (Math.random() > 0.5) {
                await likePoll(id, userId);
                console.log(`${userId} liked poll ${id}`);
            }

            if (Math.random() > 0.8) {
                await sharePoll(id, userId);
                console.log(`${userId} shared poll ${id}`);
            }

            return;
        }

        case ACTIONS.VIEW:
            await viewPoll(userId, id);
            console.log(`${userId} viewed poll ${id}`);
            return;

        case ACTIONS.FOLLOW:
            // const anotherUserId = await getAnotherUserId(userId);
            // await followUser(userId, anotherUserId);
            // console.log(`${userId} followed user ${anotherUserId}`);
            return;
    }
};

module.exports = {
    generateActivity,
};