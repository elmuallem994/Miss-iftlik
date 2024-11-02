import Categories from "./components/Categories";
import Featured from "./components/Featured";
import Offer from "./components/Offer";
import Slider from "./components/Slider";

export default function Home() {
  return (
    <main className="specific-section">
      <Slider />
      <Categories />
      <Featured />
      <Offer />
    </main>
  );
}
