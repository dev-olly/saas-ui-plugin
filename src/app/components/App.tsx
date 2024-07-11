import React from 'react';
import logo from '../assets/logo.svg';
import '../styles/output.css';
import { Tag } from './Tag';
import '../styles/ui.css';
import { Loader } from './Loader';
import { SaaSComponent } from './types';
import { TemplateImage } from './TemplateImage';

const COMPONENT_TAGS = [
  'headers',
  'top navigation',
  'side navigation',
  'cards',
  'hero images',
  'tables',
  'Lists',
  'Gallery',
  'Login',
  'Profile',
  'Help',
];

const fetchComponents = async () => {
  const response = await fetch('https://wllcbgdtuamqimemggtt.supabase.co/rest/v1/components', {
    headers: {
      apikey:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsbGNiZ2R0dWFtcWltZW1nZ3R0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY0OTY3OTEsImV4cCI6MjAzMjA3Mjc5MX0.4d2_Nh2_nysvzeCja8YE8k-3gG8lqklGtM4dEIxugsE',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsbGNiZ2R0dWFtcWltZW1nZ3R0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY0OTY3OTEsImV4cCI6MjAzMjA3Mjc5MX0.4d2_Nh2_nysvzeCja8YE8k-3gG8lqklGtM4dEIxugsE',
    },
  });
  const data = await response.json();
  return data;
};

function App() {
  const [components, setComponents] = React.useState<SaaSComponent[]>([]);
  const [loading, setLoading] = React.useState(true);

  const onClickHandler = () => {
    window.parent.postMessage({ pluginMessage: { type: 'log-node' } }, '*');
  };

  const createNode = () => {
    window.parent.postMessage({ pluginMessage: { type: 'create-node' } }, '*');
  };

  const convertNodeToJSON = () => {
    window.parent.postMessage({ pluginMessage: { type: 'convert-node-to-json' } }, '*');
  };

  React.useEffect(() => {
    // fetchComponents().then((data) => {
    //   console.log(data);
    //   setComponents(data);
    //   setLoading(false);
    // });
    // This is how we read messages sent from the plugin controller
    window.onmessage = (event) => {
      const { type, message } = event.data.pluginMessage;
      if (type === 'create-rectangles') {
        console.log(`Figma Says: ${message}`);
      } else if (type === 'copy-to-clipboard') {
        console.log(`Figma Says: ${message}`);

        if (navigator.clipboard) {
          navigator.clipboard.writeText(message);
        } else {
          const textarea = document.createElement('textarea');
          textarea.value = message;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        }

        console.log('Copied to clipboard');
      }
    };
  }, []);

  return (
    <div className="p-4">
      <h4 className="font-semibold">SaaS Templates</h4>

      <div className="tags flex flex-wrap gap-2 mt-4">
        {COMPONENT_TAGS.map((tag) => (
          <Tag key={tag} name={tag} />
        ))}
      </div>

      <div className="mt-2">
        <button className="px-3 py-2 bg-white text-sm" onClick={onClickHandler}>
          Log Node
        </button>

        <button className="px-3 py-1 border-1 text-sm border-black ml-4 rounded-md" onClick={createNode}>
          Create
        </button>

        <button className="px-3 py-1 border-1 text-sm border-black ml-4 rounded-md" onClick={convertNodeToJSON}>
          Convert Node to JSON
        </button>
      </div>

      <div className="images grid grid-cols-2 gap-4 mt-6">
        {loading ? <Loader /> : components.map((component) => <TemplateImage data={component} key={component.id} />)}
      </div>
    </div>
  );
}

export default App;
