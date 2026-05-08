import React, { useState, useEffect } from 'react';
import styles from './Quiz.module.css';

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function Quiz({ questions, topic }) {
  const [shuffled, setShuffled] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState([]);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [wrongIndexes, setWrongIndexes] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [retryMode, setRetryMode] = useState(false);

  useEffect(() => {
    setShuffled(shuffle(questions));
  }, [questions]);

  if (!shuffled.length) return null;

  const q = shuffled[current];
  const isMultiple = q.type === 'multiple';
  const total = shuffled.length;
  const progress = Math.round((current / total) * 100);

  function handleSelect(i) {
    if (isMultiple) {
      setSelected(prev =>
        prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]
      );
    } else {
      setSelected([i]);
    }
  }

  function handleNext() {
    if (!selected.length) return;

    const correctArr = Array.isArray(q.correct) ? q.correct : [q.correct];
    const isCorrect =
      selected.length === correctArr.length &&
      selected.every(s => correctArr.includes(s));

    const updatedAnswers = [...answers, { questionIndex: current, selected, isCorrect }];
    setAnswers(updatedAnswers);

    if (isCorrect) {
      setScore(prev => prev + 1);
    } else {
      setWrongIndexes(prev => [...prev, current]);
    }

    if (current + 1 >= total) {
      setFinished(true);
    } else {
      setCurrent(prev => prev + 1);
      setSelected([]);
    }
  }

  function handleRetryWrong() {
    const wrongQs = wrongIndexes.map(i => shuffled[i]);
    setShuffled(shuffle(wrongQs));
    setCurrent(0);
    setSelected([]);
    setScore(0);
    setFinished(false);
    setWrongIndexes([]);
    setAnswers([]);
    setRetryMode(true);
  }

  function handleRetryAll() {
    setShuffled(shuffle(questions));
    setCurrent(0);
    setSelected([]);
    setScore(0);
    setFinished(false);
    setWrongIndexes([]);
    setAnswers([]);
    setRetryMode(false);
  }

  const percentage = Math.round((score / total) * 100);
  const passed = percentage >= 80;

  // ── Results screen ──
  if (finished) {
    return (
      <div className={styles.card}>
        <div className={styles.resultHeader}>
          <div className={styles.resultEmoji}>{passed ? '🎉' : '📚'}</div>
          <h2 className={styles.resultTitle}>
            {passed ? 'Quiz Complete!' : 'Keep Practising'}
          </h2>
          <div className={styles.scoreBig}>
            {score} / {total}
          </div>
          <div className={`${styles.scorePercent} ${passed ? styles.pass : styles.fail}`}>
            {percentage}% — {passed ? 'Passed ✓' : 'Below 80% pass mark'}
          </div>
        </div>

        <div className={styles.resultBreakdown}>
          {shuffled.map((item, i) => {
            const wrong = wrongIndexes.includes(i);
            const correctArr = Array.isArray(item.correct)
              ? item.correct
              : [item.correct];
            const userAnswer = answers.find(a => a.questionIndex === i);
            const selectedLabels = userAnswer
              ? userAnswer.selected.map(s => item.options[s]).join(', ')
              : '—';

            return (
              <div
                key={i}
                className={`${styles.breakdownRow} ${wrong ? styles.breakdownWrong : styles.breakdownRight}`}
              >
                <span className={styles.breakdownIcon}>{wrong ? '✗' : '✓'}</span>
                <div className={styles.breakdownContent}>
                  <span className={styles.breakdownText}>{item.question}</span>
                  <span className={styles.breakdownAnswer}>
                    Correct: {correctArr.map(c => item.options[c]).join(', ')}
                  </span>
                  {wrong && (
                    <span className={styles.breakdownYourAnswer}>
                      Your answer: {selectedLabels}
                    </span>
                  )}
                  {wrong && (
                    <span className={styles.breakdownExplanation}>
                      {item.explanation}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.resultActions}>
          {wrongIndexes.length > 0 && (
            <button className={styles.btnPrimary} onClick={handleRetryWrong}>
              Retry {wrongIndexes.length} wrong answer{wrongIndexes.length > 1 ? 's' : ''}
            </button>
          )}
          <button className={styles.btnOutline} onClick={handleRetryAll}>
            Restart quiz
          </button>
        </div>
      </div>
    );
  }

  // ── Question screen ──
  return (
    <div className={styles.card}>
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.topic}>
          {retryMode ? `${topic} — Retry` : topic}
        </span>
        <span className={styles.counter}>
          Question {current + 1} of {total}
        </span>
      </div>

      {/* Progress bar */}
      <div className={styles.progressTrack}>
        <div
          className={styles.progressFill}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question */}
      <p className={styles.question}>{q.question}</p>
      {isMultiple && (
        <p className={styles.hint}>Select all that apply</p>
      )}

      {/* Options */}
      <div className={styles.options}>
        {q.options.map((opt, i) => {
          const isSelected = selected.includes(i);
          let optClass = styles.option;
          if (isSelected) optClass = `${styles.option} ${styles.selected}`;

          return (
            <button
              key={i}
              className={optClass}
              onClick={() => handleSelect(i)}
            >
              <span className={styles.optionLetter}>
                {String.fromCharCode(65 + i)}
              </span>
              <span className={styles.optionText}>{opt}</span>
            </button>
          );
        })}
      </div>

      {/* Navigation — single Next button, no previous */}
      <div className={styles.nav}>
        <div />
        <button
          className={styles.btnPrimary}
          onClick={handleNext}
          disabled={!selected.length}
        >
          {current + 1 >= total ? 'See results' : 'Next →'}
        </button>
      </div>
    </div>
  );
}
