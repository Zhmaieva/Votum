const {getRandomUserId, getAnotherUserId, followUser} = require("../db/dal/userQueries");
const {voteOnPoll, fetchPolls, likePoll, viewPoll, sharePoll} = require("../db/dal/pollQueries");

const ACTIONS = {
    VOTE: 1,
    VIEW: 2,
    FOLLOW: 3,
}

const getNextAvailablePoll = async (userId) => {
    const pollsFeed = await fetchPolls(userId);
    if (pollsFeed.length === 0)
        return { id: null, options: []};

   return { id: pollsFeed[0].id, options: pollsFeed[0].options ?? []};
}

const generateActivity = async () => {
    if (Math.random() > 0.05) //randomly skip activity
        return;

    const userId = await getRandomUserId('@votum.com');

    if (!userId)
        return;

    const action = Math.floor((Math.random() * 100) % Object.keys(ACTIONS).length);
    const { id, options } = await getNextAvailablePoll(userId);

    if (!id || (options?.length === 0 ?? true))
        return;

    switch (action) {
        default: return;

        case ACTIONS.VOTE:
            const optionIndex = Math.floor((Math.random() * 100) % (options?.length ?? 1));
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
    generateActivity
}