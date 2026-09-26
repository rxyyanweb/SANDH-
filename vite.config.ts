import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import {defineConfig} from 'vite';

const rootDir =
  typeof import.meta.dirname === 'string'
    ? import.meta.dirname
    : path.dirname(fileURLToPath(import.meta.url));

const FILE_MAP: Record<string, string> = {
  'main.tsx': 'src/main.tsx',
  'App.tsx': 'src/App.tsx',
  'index.css': 'src/index.css',
  'restaurant.ts': 'src/types/restaurant.ts',
  'hours.ts': 'src/utils/hours.ts',
  'validation.ts': 'src/utils/validation.ts',
  'restaurantData.ts': 'src/data/restaurantData.ts',
  'RestaurantContext.tsx': 'src/context/RestaurantContext.tsx',
  'Navbar.tsx': 'src/components/Navbar.tsx',
  'Hero.tsx': 'src/components/Hero.tsx',
  'ServiceHighlightsSection.tsx': 'src/components/ServiceHighlightsSection.tsx',
  'MenuSection.tsx': 'src/components/MenuSection.tsx',
  'DealsSection.tsx': 'src/components/DealsSection.tsx',
  'TableBookingSection.tsx': 'src/components/TableBookingSection.tsx',
  'GallerySection.tsx': 'src/components/GallerySection.tsx',
  'AboutSection.tsx': 'src/components/AboutSection.tsx',
  'ReviewsSection.tsx': 'src/components/ReviewsSection.tsx',
  'LocationSection.tsx': 'src/components/LocationSection.tsx',
  'Footer.tsx': 'src/components/Footer.tsx',
  'MobileBottomNav.tsx': 'src/components/MobileBottomNav.tsx',
  'CartDrawer.tsx': 'src/components/CartDrawer.tsx',
  'ItemCustomizerModal.tsx': 'src/components/ItemCustomizerModal.tsx',
  'CheckoutModal.tsx': 'src/components/CheckoutModal.tsx',
  'OrderConfirmationModal.tsx': 'src/components/OrderConfirmationModal.tsx',
  'OrdersModal.tsx': 'src/components/OrdersModal.tsx',
  'BookingsModal.tsx': 'src/components/BookingsModal.tsx',
  'FavoritesModal.tsx': 'src/components/FavoritesModal.tsx',
  'ReviewModal.tsx': 'src/components/ReviewModal.tsx',
  'DemoWebsiteNoticeToast.tsx': 'src/components/DemoWebsiteNoticeToast.tsx',
  'UpdatesModal.tsx': 'src/components/UpdatesModal.tsx',
};

function ensureSrcStructure() {
  try {
    for (const [flatName, targetRel] of Object.entries(FILE_MAP)) {
      const targetPath = path.resolve(rootDir, targetRel);
      const flatPath = path.resolve(rootDir, flatName);
      const altRelPath = path.resolve(rootDir, targetRel.replace(/^src\//, ''));

      if (!fs.existsSync(targetPath)) {
        const sourcePath = fs.existsSync(flatPath)
          ? flatPath
          : fs.existsSync(altRelPath)
            ? altRelPath
            : null;
        if (sourcePath) {
          fs.mkdirSync(path.dirname(targetPath), {recursive: true});
          fs.copyFileSync(sourcePath, targetPath);
        }
      }
    }

    // Also copy any root .jpg/.png/.webp image files into src/assets/images if missing
    const imgDestDir = path.resolve(rootDir, 'src/assets/images');
    fs.mkdirSync(imgDestDir, {recursive: true});
    for (const entry of fs.readdirSync(rootDir)) {
      if (/\.(jpg|jpeg|png|webp|svg)$/i.test(entry)) {
        const srcImg = path.resolve(rootDir, entry);
        const destImg = path.resolve(imgDestDir, entry);
        if (!fs.existsSync(destImg) && fs.statSync(srcImg).isFile()) {
          fs.copyFileSync(srcImg, destImg);
        }
      }
    }
  } catch {
    // Ignore fs errors in read-only environments
  }
}

// Self-heal directory structure before Vite scans index.html
ensureSrcStructure();

function copySrcAssetsPlugin() {
  return {
    name: 'copy-src-assets',
    buildStart() {
      ensureSrcStructure();
    },
    closeBundle() {
      const srcDir = path.resolve(rootDir, 'src/assets/images');
      const destDir = path.resolve(rootDir, 'dist/src/assets/images');
      if (fs.existsSync(srcDir)) {
        fs.mkdirSync(destDir, {recursive: true});
        for (const file of fs.readdirSync(srcDir)) {
          const srcFile = path.join(srcDir, file);
          if (fs.statSync(srcFile).isFile()) {
            fs.copyFileSync(srcFile, path.join(destDir, file));
          }
        }
      }
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), copySrcAssetsPlugin()],
    build: {
      chunkSizeWarningLimit: 1500,
    },
    resolve: {
      alias: {
        '@': path.resolve(rootDir, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
