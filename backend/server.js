import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import { sequelize } from './src/config/database.js';
import { errorHandler, notFoundHandler } from './src/middleware/errorHandler.js';
import contactRoutes from './src/routes/contact.routes.js';
import authRoutes from './src/routes/auth.routes.js';
import blogRoutes from './src/routes/blog.routes.js';
import serviceRoutes from './src/routes/service.routes.js';
import productRoutes from './src/routes/product.routes.js';
import launchRoutes from './src/routes/launch.routes.js';
import faqRoutes from './src/routes/faq.routes.js';
import teamRoutes from './src/routes/team.routes.js';
import newsletterRoutes from './src/routes/newsletter.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ═══════════════════════════════════════════════
// MIDDLEWARE
// ═══════════════════════════════════════════════

// Security
app.use(helmet());
app.use(compression());

// CORS
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ═══════════════════════════════════════════════
// ROUTES
// ═══════════════════════════════════════════════

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/contatos', contactRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/servicos', serviceRoutes);
app.use('/api/produtos', productRoutes);
app.use('/api/lancamentos', launchRoutes);
app.use('/api/faq', faqRoutes);
app.use('/api/equipe', teamRoutes);
app.use('/api/newsletter', newsletterRoutes);

// ═══════════════════════════════════════════════
// ERROR HANDLING
// ═══════════════════════════════════════════════

app.use(notFoundHandler);
app.use(errorHandler);

// ═══════════════════════════════════════════════
// DATABASE & SERVER START
// ═══════════════════════════════════════════════

const startServer = async () => {
  try {
    // Test database connection (optional - continue if fails)
    try {
      await sequelize.authenticate();
      console.log('✅ Database connection established');

      // Sync models (development only - use migrations in production)
      if (process.env.NODE_ENV === 'development') {
        await sequelize.sync({ alter: true });
        console.log('✅ Database models synchronized');
      }
    } catch (dbError) {
      console.warn('⚠️  Database connection failed - running in offline mode');
      console.warn('   ' + dbError.message);
    }

    // Start server
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════╗
║   🌱 RENOVERDE BACKEND SERVER        
║   
║   Server running on: http://localhost:${PORT}
║   Environment: ${process.env.NODE_ENV}
║   Database: ${process.env.DB_NAME}
║   
╚════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

export default app;
