import Calendar from "./components/Calendar/Calendar";
import Header from "./components/Header/Header";

function App() {
  return (
    <div>
      <Header
        title="DoodleDay"
        subtitle="Plan your days with a splash of colour ✨"
      />
      <Calendar />
    </div>
  );
}

export default App;
