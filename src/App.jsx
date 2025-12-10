import Dashboard from './components/Dashboard';
import { DataProvider } from './context/DataContext';

function App() {
  return (
    <DataProvider>
      <div className="min-h-screen bg-black text-white selection:bg-ios-blue selection:text-white">
        <Dashboard />
      </div>
    </DataProvider>
  )
}

export default App
