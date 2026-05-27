from collections import Counter


def calculate_exam_analytics(
    questions,
    results
):

    analytics = []

    for index, question in enumerate(questions):

        answer_counts = Counter()

        correct_count = 0

        total_attempts = 0

        for result in results:

            answers = result.get(
                "answers",
                {}
            )

            selected = answers.get(
                str(index)
            )

            if selected:

                answer_counts[selected] += 1

                total_attempts += 1

                if selected == question["correct_answer"]:

                    correct_count += 1

        wrong_count = (
            total_attempts -
            correct_count
        )

        analytics.append({

            "question":
                question["question"],

            "correct_count":
                correct_count,

            "wrong_count":
                wrong_count,

            "distribution": {

                "A":
                    answer_counts.get("A", 0),

                "B":
                    answer_counts.get("B", 0),

                "C":
                    answer_counts.get("C", 0),

                "D":
                    answer_counts.get("D", 0),
            }
        })

    return analytics