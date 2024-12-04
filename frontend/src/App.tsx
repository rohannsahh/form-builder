import FormEditor from "./components/FormEditor";


function App() {

  return (
    <div className="min-h-screen max-w-full bg-gray-100">
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <h1 className="text-2xl font-bold text-gray-900">Form Builder</h1>
      </div>
    </header>
    <main className="max-w-7xl mx-auto px-4 py-6">
      <FormEditor />
      </main>
    </div>
  )
}

export default App
