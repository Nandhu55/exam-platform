def calculate_next_difficulty(
    current_difficulty: int,
    is_correct: bool,
    min_difficulty: int,
    max_difficulty: int
):

    if is_correct:

        current_difficulty += 1

    else:

        current_difficulty -= 1

    if current_difficulty < min_difficulty:

        current_difficulty = min_difficulty

    if current_difficulty > max_difficulty:

        current_difficulty = max_difficulty

    return current_difficulty