"use client"

interface SearchBarProps {
    query: string
    onQueryChange: (
        newQuery: string
    ) => void
}

export default function SearchBar({
    query,
    onQueryChange
}: SearchBarProps) {

    return (

        <div className="relative mb-8">

            <span className="absolute left-4 top-3.5 text-slate-400 text-lg">
                🔎
            </span>

            <input
                type="text"
                value={query}
                onChange={(e) =>
                    onQueryChange(
                        e.target.value
                    )
                }
                placeholder="Buscar por destino, ciudad o país..."
                className="w-full bg-slate-800 text-white rounded-xl pl-12 pr-4 py-3 border border-slate-700 focus:outline-none focus:border-blue-500 transition-colors"
            />

        </div>

    )
}