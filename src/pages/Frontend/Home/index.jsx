import About from "./About"
import Categories from "./Categories"
import Hero from "./Hero"
import SpecialOffers from "./SpecialOffers"
import WhyChooseUs from "./WhyChooseUs "

const index = () => {
    return (
        <>
            <section>
                <Hero />
                <Categories />
                <About />
                <WhyChooseUs />
                <SpecialOffers />
            </section>

        </>
    )
}

export default index