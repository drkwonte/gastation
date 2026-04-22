import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from './layout/AppShell'
import { MapPage } from './pages/MapPage'
import { PostsPage } from './pages/PostsPage'
import { PostPage } from './pages/PostPage'
import { AboutPage } from './pages/AboutPage'
import { PrivacyPage } from './pages/PrivacyPage'
import { ContactPage } from './pages/ContactPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <MapPage /> },
      { path: 'posts', element: <PostsPage /> },
      { path: 'posts/:slug', element: <PostPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'privacy', element: <PrivacyPage /> },
      { path: 'contact', element: <ContactPage /> },
    ],
  },
])

