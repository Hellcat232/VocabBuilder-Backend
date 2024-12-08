import { CategoriesCollection } from '../database/models/categories-schema.js';
import { PublicWordsCollection } from '../database/models/public-words-schema.js';

import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const findPublicWord = (filter) => PublicWordsCollection.findOne(filter);

export const getCategories = async (name) => {
  const categories = await CategoriesCollection.find({ name });

  return categories;
};

export const createWord = async ({ en, ua, category, isIrregular, userId, addedBy }) => {
  const newWord = await PublicWordsCollection.create({
    en,
    ua,
    category,
    isIrregular,
    owner: userId,
    addedBy,
  });

  return {
    _id: newWord._id,
    en: newWord.en,
    ua: newWord.ua,
    category: newWord.category,
    isIrregular: newWord.isIrregular,
    owner: newWord.owner,
    addedBy: newWord.addedBy,
    progress: newWord.progress,
  };
};

export const updateWord = async (wordId, data) => {
  const updatedWord = await PublicWordsCollection.findByIdAndUpdate(wordId, data, { new: true });

  return updatedWord;
};

export const getAllPablicWords = async ({ page, perPage }) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const wordsQuery = PublicWordsCollection.find();
  const countQueryWords = await PublicWordsCollection.find().merge(wordsQuery).countDocuments();

  const getAll = await wordsQuery.skip(skip).limit(limit);

  const paginationData = calculatePaginationData(countQueryWords, page, perPage);

  return {
    getAll,
    ...paginationData,
  };
};
