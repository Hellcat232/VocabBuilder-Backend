import { CategoriesCollection } from '../database/models/categories-schema.js';
import { PublicWordsCollection } from '../database/models/public-words-schema.js';

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
