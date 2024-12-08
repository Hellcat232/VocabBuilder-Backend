import { UserWordsCollection } from '../database/models/user-words-schema.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const findUserWords = (filter) => UserWordsCollection.findOne(filter);

export const addWordToUserCollection = async (word) => {
  const { _id, en, ua, owner, progress, category, isIrregular, addedBy } = word;

  const addWord = await UserWordsCollection.create({
    en,
    ua,
    owner,
    progress,
    category,
    isIrregular,
    addedBy,
  });

  return addWord;
};

export const updateSelfWord = async (wordId, { data, userId }) => {
  const updatedSelfWord = await UserWordsCollection.findByIdAndUpdate(
    wordId,
    { ...data, owner: userId },
    { new: true },
  );

  return updatedSelfWord;
};

export const deletePrivateWord = async (wordId) => {
  await UserWordsCollection.deleteOne({ _id: wordId });
};

export const getAllPrivateWords = async ({ page, perPage }) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const queryWords = UserWordsCollection.find();
  const countQueryWords = await UserWordsCollection.find().merge(queryWords).countDocuments();

  const getPrivateWords = await queryWords.skip(skip).limit(limit);

  const paginationData = calculatePaginationData(countQueryWords, page, perPage);

  return {
    getPrivateWords,
    ...paginationData,
  };
};
