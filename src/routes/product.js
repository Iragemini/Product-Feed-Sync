import { Router } from 'express';

export const productsRouter = (dependencies) => {
  const router = Router();
  const { productsService } = dependencies;

  router.get('/search', async (req, res) => {
    const { title } = req.query
    const products = await productsService.findByTitle(title);
    res.status(200).json(products);
  });

  return router;
};
