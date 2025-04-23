import React, { useState, useEffect } from "react";
import styles from "./Challenge.module.css";
import { auth, db, doc, setDoc, getDoc, updateDoc } from "../login/FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const challenges = [
  {
    title: "Easy Challenges",
    level: "easy",
    problems: [
      { name: "Two Sum", link: "https://leetcode.com/problems/two-sum/" },
      { name: "Palindrome Number", link: "https://leetcode.com/problems/palindrome-number/" },
      { name: "Valid Parentheses", link: "https://leetcode.com/problems/valid-parentheses/" },
      { name: "Merge Two Sorted Lists", link: "https://leetcode.com/problems/merge-two-sorted-lists/" },
      { name: "Best Time to Buy and Sell Stock", link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/" },
      { name: "Valid Anagram", link: "https://leetcode.com/problems/valid-anagram/" },
      { name: "Majority Element", link: "https://leetcode.com/problems/majority-element/" },
      { name: "Contains Duplicate", link: "https://leetcode.com/problems/contains-duplicate/" },
      { name: "Reverse Linked List", link: "https://leetcode.com/problems/reverse-linked-list/" },
      { name: "Climbing Stairs", link: "https://leetcode.com/problems/climbing-stairs/" },
      { name: "Power of Two", link: "https://leetcode.com/problems/power-of-two/" },
      { name: "Intersection of Two Arrays", link: "https://leetcode.com/problems/intersection-of-two-arrays/" },
      { name: "Roman to Integer", link: "https://leetcode.com/problems/roman-to-integer/" },
      { name: "Excel Sheet Column Number", link: "https://leetcode.com/problems/excel-sheet-column-number/" },
      { name: "Fizz Buzz", link: "https://leetcode.com/problems/fizz-buzz/" },
      { name: "Middle of the Linked List", link: "https://leetcode.com/problems/middle-of-the-linked-list/" },
      { name: "Remove Duplicates from Sorted Array", link: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/" },
      { name: "Remove Element", link: "https://leetcode.com/problems/remove-element/" },
      { name: "Longest Common Prefix", link: "https://leetcode.com/problems/longest-common-prefix/" },
      { name: "Plus One", link: "https://leetcode.com/problems/plus-one/" },
      { name: "Merge Sorted Array", link: "https://leetcode.com/problems/merge-sorted-array/" },
      { name: "Linked List Cycle", link: "https://leetcode.com/problems/linked-list-cycle/" },
      { name: "Missing Number", link: "https://leetcode.com/problems/missing-number/" },
      { name: "Binary Search", link: "https://leetcode.com/problems/binary-search/" },
      { name: "Guess Number Higher or Lower", link: "https://leetcode.com/problems/guess-number-higher-or-lower/" }
    ]
    
  },
  {
    title: "Medium Challenges",
    level: "medium",
    problems : [
      { name: "Add Two Numbers", link: "https://leetcode.com/problems/add-two-numbers/" },
      { name: "Longest Substring Without Repeating Characters", link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
      { name: "3Sum", link: "https://leetcode.com/problems/3sum/" },
      { name: "Container With Most Water", link: "https://leetcode.com/problems/container-with-most-water/" },
      { name: "Integer to Roman", link: "https://leetcode.com/problems/integer-to-roman/" },
      { name: "Letter Combinations of a Phone Number", link: "https://leetcode.com/problems/letter-combinations-of-a-phone-number/" },
      { name: "Generate Parentheses", link: "https://leetcode.com/problems/generate-parentheses/" },
      { name: "Merge Intervals", link: "https://leetcode.com/problems/merge-intervals/" },
      { name: "Next Permutation", link: "https://leetcode.com/problems/next-permutation/" },
      { name: "Search in Rotated Sorted Array", link: "https://leetcode.com/problems/search-in-rotated-sorted-array/" },
      { name: "Combination Sum", link: "https://leetcode.com/problems/combination-sum/" },
      { name: "Permutations", link: "https://leetcode.com/problems/permutations/" },
      { name: "Group Anagrams", link: "https://leetcode.com/problems/group-anagrams/" },
      { name: "Rotate Array", link: "https://leetcode.com/problems/rotate-array/" },
      { name: "Maximum Subarray", link: "https://leetcode.com/problems/maximum-subarray/" },
      { name: "Jump Game", link: "https://leetcode.com/problems/jump-game/" },
      { name: "Sort Colors", link: "https://leetcode.com/problems/sort-colors/" },
      { name: "Course Schedule", link: "https://leetcode.com/problems/course-schedule/" },
      { name: "Word Break", link: "https://leetcode.com/problems/word-break/" },
      { name: "Spiral Matrix", link: "https://leetcode.com/problems/spiral-matrix/" },
      { name: "Unique Paths", link: "https://leetcode.com/problems/unique-paths/" },
      { name: "Set Matrix Zeroes", link: "https://leetcode.com/problems/set-matrix-zeroes/" },
      { name: "Flatten Binary Tree to Linked List", link: "https://leetcode.com/problems/flatten-binary-tree-to-linked-list/" },
      { name: "Kth Smallest Element in a BST", link: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/" },
      { name: "Top K Frequent Elements", link: "https://leetcode.com/problems/top-k-frequent-elements/" }
    ]
  },
  {
    title: "Hard Challenges",
    level: "hard",
    problems : [
      { name: "Merge k Sorted Lists", link: "https://leetcode.com/problems/merge-k-sorted-lists/" },
      { name: "Trapping Rain Water", link: "https://leetcode.com/problems/trapping-rain-water/" },
      { name: "Regular Expression Matching", link: "https://leetcode.com/problems/regular-expression-matching/" },
      { name: "First Missing Positive", link: "https://leetcode.com/problems/first-missing-positive/" },
      { name: "N-Queens", link: "https://leetcode.com/problems/n-queens/" },
      { name: "Sudoku Solver", link: "https://leetcode.com/problems/sudoku-solver/" },
      { name: "Word Ladder II", link: "https://leetcode.com/problems/word-ladder-ii/" },
      { name: "LFU Cache", link: "https://leetcode.com/problems/lfu-cache/" },
      { name: "Largest Rectangle in Histogram", link: "https://leetcode.com/problems/largest-rectangle-in-histogram/" },
      { name: "Max Points on a Line", link: "https://leetcode.com/problems/max-points-on-a-line/" },
      { name: "Minimum Window Substring", link: "https://leetcode.com/problems/minimum-window-substring/" },
      { name: "Sliding Window Maximum", link: "https://leetcode.com/problems/sliding-window-maximum/" },
      { name: "Median of Two Sorted Arrays", link: "https://leetcode.com/problems/median-of-two-sorted-arrays/" },
      { name: "Shortest Path in a Grid with Obstacles Elimination", link: "https://leetcode.com/problems/shortest-path-in-a-grid-with-obstacles-elimination/" },
      { name: "Russian Doll Envelopes", link: "https://leetcode.com/problems/russian-doll-envelopes/" },
      { name: "Palindrome Partitioning II", link: "https://leetcode.com/problems/palindrome-partitioning-ii/" },
      { name: "Edit Distance", link: "https://leetcode.com/problems/edit-distance/" },
      { name: "Minimum Cost to Cut a Stick", link: "https://leetcode.com/problems/minimum-cost-to-cut-a-stick/" },
      { name: "Bursty Balancer", link: "https://leetcode.com/problems/burst-balloons/" },
      { name: "Alien Dictionary", link: "https://leetcode.com/problems/alien-dictionary/" },
      { name: "Critical Connections in a Network", link: "https://leetcode.com/problems/critical-connections-in-a-network/" },
      { name: "Longest Valid Parentheses", link: "https://leetcode.com/problems/longest-valid-parentheses/" },
      { name: "Largest Component Size by Common Factor", link: "https://leetcode.com/problems/largest-component-size-by-common-factor/" },
      { name: "Substring with Concatenation of All Words", link: "https://leetcode.com/problems/substring-with-concatenation-of-all-words/" },
      { name: "Super Egg Drop", link: "https://leetcode.com/problems/super-egg-drop/" }
    ]
  }
];

const ChallengePage = () => {
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [checkedProblems, setCheckedProblems] = useState({});
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Listen for user authentication state
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        loadUserProgress(currentUser.uid);
      } else {
        setUser(null);
        setCheckedProblems({});
      }
    });

    return () => unsubscribe();
  }, []);

  // Load saved progress from Firebase
  const loadUserProgress = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        setCheckedProblems(userDoc.data().progress || {});
      }
    } catch (error) {
      console.error("Error loading progress:", error);
    }
  };

  // Handle checkbox change
  const handleCheckboxChange = async (challengeTitle, problemName) => {
    if (!user) {
      alert("Please log in to save progress.");
      return;
    }

    const newCheckedProblems = { ...checkedProblems };
    if (!newCheckedProblems[challengeTitle]) {
      newCheckedProblems[challengeTitle] = {};
    }

    newCheckedProblems[challengeTitle][problemName] = !newCheckedProblems[challengeTitle][problemName];

    setCheckedProblems(newCheckedProblems);

    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { progress: newCheckedProblems }, { merge: true });
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  return (
    
    <section className={styles.challenges} id="challenges">
 
      <div className={styles.container}>
        <h2 className={styles.challengeTitle}>Challenges</h2>

        {!selectedChallenge && (
          <div className={styles.challengeGrid}>
            {challenges.map((challenge, index) => (
              <div className={styles.challengeCard} key={index}>
                <h3>{challenge.title}</h3>
                <p id="divpara1">Contains {challenge.problems.length} problems</p>
                <button className={styles.solveBtn} onClick={() => setSelectedChallenge(challenge)}>
                  View Problems
                </button>
              </div>
            ))}
          </div>
        )}

        {selectedChallenge && (
          <div className={styles.problemList}>
            <h3>{selectedChallenge.title}</h3>
            <table className={styles.problemTable}>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Problem Name</th>
                  <th>Action</th>
                  <th>Completed</th>
                </tr>
              </thead>
              <tbody>
                {selectedChallenge.problems.map((problem, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{problem.name}</td>
                    <td>
                      <button className={styles.solveBtn} onClick={() => window.open(problem.link, "_blank")}>
                        Solve
                      </button>
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={checkedProblems[selectedChallenge.title]?.[problem.name] || false}
                        onChange={() => handleCheckboxChange(selectedChallenge.title, problem.name)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className={styles.backBtn} onClick={() => setSelectedChallenge(null)}>Back</button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ChallengePage;
