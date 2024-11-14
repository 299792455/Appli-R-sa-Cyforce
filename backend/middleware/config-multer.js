const multer = require('multer');
const path = require('path');
const sharp = require('sharp');

// Configuration du stockage
const storage = multer.memoryStorage();

// Filtre de fichier
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Seuls les fichiers JPEG, JPG et PNG sont autorisés.'));
  }
};

// Middleware Multer avec Sharp pour l'optimisation des images
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
}).single('image'); // 'image' est le nom du champ dans le formulaire

// Middleware pour traiter l'image
const processImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    const optimizedImage = await sharp(req.file.buffer)
      .resize(800, 800, { fit: 'inside' })
      .toFormat('jpeg')
      .jpeg({ quality: 80 })
      .toBuffer();

    req.file.buffer = optimizedImage;
    req.file.filename = `${Date.now()}-${req.file.originalname}`;

    // Enregistrer l'image sur le serveur
    const imagePath = path.join(__dirname, '..', 'images', req.file.filename);
    await sharp(req.file.buffer).toFile(imagePath);

    req.body.imageUrl = `/images/${req.file.filename}`;
    next();
  } catch (error) {
    console.error('Erreur lors de l\'optimisation de l\'image :', error);
    res.status(500).json({ message: 'Erreur lors de l\'optimisation de l\'image.', error: error.message });
  }
};

module.exports = { upload, processImage };
