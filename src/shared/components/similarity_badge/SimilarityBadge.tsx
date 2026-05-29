export const getSimilarityBadge = (similarity: number) => {
    const roundedSimilarity = Math.round(similarity);

    let badgeClass = "px-3 py-1 text-xs font-bold rounded-full whitespace-nowrap ";
    if (roundedSimilarity >= 40) {
        badgeClass += "bg-brand text-white";
    } else if (roundedSimilarity >= 10) {
        badgeClass += "bg-cyan-600 text-white";
    } else {
        badgeClass += "bg-gray-200 text-secondary";
    }

    return (
        <span className={badgeClass}>
            {roundedSimilarity}% match
            </span>
    );
};