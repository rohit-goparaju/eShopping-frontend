import { useUserContext } from "./App";

export default function Home(){
    const {user} = useUserContext();

    return (
        <>
            <h1>
                Welcome to eShopping {user}
            </h1>
        </>
    );
}