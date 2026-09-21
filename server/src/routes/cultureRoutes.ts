import { Router } from 'express';
import {
  getRandomRiddle,
  checkRiddleAnswer,
  generatePoetryOrProverb,
  checkGrammarAndSpelling,
} from '../controllers/cultureController';

const router = Router();

// Ibisakuzo (Rwandan Riddles Game)
router.get('/riddles/random', getRandomRiddle);
router.post('/riddles/check', checkRiddleAnswer);

// Poetry & Proverbs (Ibisigo n'Imigani)
router.post('/poetry/generate', generatePoetryOrProverb);

// Ikosora-Nteruro (Spell & Grammar Checker)
router.post('/spellcheck', checkGrammarAndSpelling);

export default router;
