// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { FormView } from './components/FormView';
// import FormEditor  from './components/FormEditor';
// // import { FormsList } from './components/FormsList';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<FormEditor />} />
//         <Route path="/forms/edit/:id" element={<FormEditor />} />
//         <Route path="/forms/:id" element={<FormView />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;


import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FormEditor from './components/FormEditor';
import FormRenderer from './components/FormRenderer';
import { FormsList } from './components/FormsList';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Form Builder</h1>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<FormsList />} />
            <Route path="/create" element={<FormEditor />} />
            <Route path="/edit/:formId" element={<FormEditor />} />
            <Route path="/form/:formId" element={<FormRenderer />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;