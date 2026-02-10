import './index.css';
import App from './App';

/**
 * Re-export the Prompt Notebook App for lazy loading in the main portfolio router
 */
export default function PromptNotebookApp() {
  return <App />;
}
