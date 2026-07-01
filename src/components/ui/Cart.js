export default async function Cart() {
    const items = [
        { id: 1, name: "Item 1", price: 10 },
        { id: 2, name: "Item 2", price: 20 },
        { id: 3, name: "Item 3", price: 30 },
    ];

    const total = items.reduce((sum, item) => sum + item.price, 0);

    return (
        <div>
            <h2 className="mb-4 text-2xl font-bold">Your Cart</h2>

            <ul className="space-y-2">
                {items.map((item) => (
                <li key={item.id} className="flex justify-between gap-8">
                    <span>{item.name}</span>
                    <span>${item.price}</span>
                </li>
                ))}
            </ul>

            <hr className="my-4" />

            <p className="font-semibold">Total: ${total}</p>
        </div>
    )
}