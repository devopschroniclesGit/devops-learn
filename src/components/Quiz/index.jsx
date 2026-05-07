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
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [wrongIndexes, setWrongIndexes] = useState([]);
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
    if (answered) return;
    if (isMultiple) {
      setSelected(prev =>
        prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]
      );
    } else {
      setSelected([i]);
    }
  }

  function handleSubmit() {
    if (!selected.length) return;
    setAnswered(true);

    const correctArr = Array.isArray(q.correct) ? q.correct : [q.correct];
    const isCorrect =
      selected.length === correctArr.length &&
      selected.every(s => correctArr.includes(s));

    if (isCorrect) {
      setScore(prev => prev + 1);
    } else {
      setWrongIndexes(prev => [...prev, current]);
    }
  }

  function handleNext() {
    if (current + 1 >= total) {
      setFinished(true);
    } else {
      setCurrent(prev => prev + 1);
      setSelected([]);
      setAnswered(false);
    }
  }

  function handlePrev() {
    if (current > 0) {
      setCurrent(prev => prev - 1);
      setSelected([]);
      setAnswered(false);
    }
  }

  function handleRetryWrong() {
    const wrongQs = wrongIndexes.map(i => shuffled[i]);
    setShuffled(shuffle(wrongQs));
    setCurrent(0);
    setSelected([]);
    setAnswered(false);
    setScore(0);
    setFinished(false);
    setWrongIndexes([]);
    setRetryMode(true);
  }

  function handleRetryAll() {
    setShuffled(shuffle(questions));
    setCurrent(0);
    setSelected([]);
    setAnswered(false);
    setScore(0);
    setFinished(false);
    setWrongIndexes([]);
    setRetryMode(false);
  }

  const correctArr = Array.isArray(q.correct) ? q.correct : [q.correct];
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
            {percentage}% — {passed ? 'Passed' : 'Below 80% pass mark'}
          </div>
        </div>

        <div className={styles.resultBreakdown}>
          {shuffled.map((item, i) => {
            const wrong = wrongIndexes.includes(i);
            return (
              <div key={i} className={`${styles.breakdownRow} ${wrong ? styles.breakdownWrong : styles.breakdownRight}`}>
                <span className={styles.breakdownIcon}>{wrong ? '✗' : '✓'}</span>
                <span className={styles.breakdownText}>{item.question}</span>
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
        <span className={styles.topic}>{retryMode ? `${topic} — Retry` : topic}</span>
        <span className={styles.counter}>Question {current + 1} of {total}</span>
      </div>

      {/* Progress bar */}
      <div className={styles.progressTrack}>
        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
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
          const isCorrect = correctArr.includes(i);

          let optClass = styles.option;
          if (answered) {
            if (isCorrect) optClass = `${styles.option} ${styles.correct}`;
            else if (isSelected && !isCorrect) optClass = `${styles.option} ${styles.wrong}`;
          } else if (isSelected) {
            optClass = `${styles.option} ${styles.selected}`;
          }

          return (
            <button key={i} className={optClass} onClick={() => handleSelect(i)}>
              <span className={styles.optionLetter}>
                {String.fromCharCode(65 + i)}
              </span>
              <span className={styles.optionText}>{opt}</span>
              {answered && isCorrect && (
                <span className={styles.tick}>✓</span>
              )}
              {answered && isSelected && !isCorrect && (
                <span className={styles.cross}>✗</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {answered && (
        <div className={`${styles.explanation} ${correctArr.every(c => selected.includes(c)) && selected.length === correctArr.length ? styles.explanationCorrect : styles.explanationWrong}`}>
          <strong>
            {correctArr.every(c => selected.includes(c)) && selected.length === correctArr.length
              ? '✓ Correct!'
              : '✗ Incorrect'}
          </strong>
          <p>{q.explanation}</p>
        </div>
      )}

      {/* Navigation */}
      <div className={styles.nav}>
        <button
          className={styles.btnOutline}
          onClick={handlePrev}
          disabled={current === 0}
        >
          ← Previous
        </button>

        {!answered ? (
          <button
            className={styles.btnPrimary}
            onClick={handleSubmit}
            disabled={!selected.length}
          >
            Submit answer
          </button>
        ) : (
          <button className={styles.btnPrimary} onClick={handleNext}>
            {current + 1 >= total ? 'See results' : 'Next →'}
          </button>
        )}
      </div>
    </div>
  );
}
