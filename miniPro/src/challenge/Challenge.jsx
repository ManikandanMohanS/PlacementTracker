import React, { useState, useEffect } from "react";
import { auth, db, doc, setDoc, getDoc } from "../login/FirebaseConfig";
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
    <div style={{
      backgroundColor: "#0a192f",
      minHeight: "calc(100vh - 64px)", // Subtract navbar height
      color: "#ccd6f6",
      padding: "0",
      margin: "0",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      width: "100%",
      overflowX: "hidden",
      height: "110vh", // Full viewport height
      // Adjust for fixed navbar height
    }}>
      <div style={{
        width: "100%",
        maxWidth: "1200px",
        padding: "2rem 1rem",
        margin: "0 auto",
        marginTop: "10px",
        boxSizing: "border-box"
      }}>
        <h2 style={{
          textAlign: "center",
          fontSize: "2.5rem",
          margin: "1rem 0 2rem 0",
          fontWeight: "700",
          color: "#64ffda",
          textTransform: "uppercase",
          letterSpacing: "1px",
          marginTop: "100px",
          marrginBottom: "90px",
       
        }}>
          Challenges
        </h2>

        {!selectedChallenge && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1.5rem",
            margin: "0 auto",
            width: "100%",
            marginTop: "100px",
            justifyContent: "center"
          }}>
            {challenges.map((challenge, index) => (
              <div key={index} style={{
                backgroundColor: "#112240",
                borderRadius: "8px",
                padding: "1.5rem",
                boxShadow: "0 10px 30px -15px rgba(2, 12, 27, 0.7)",
                transition: "all 0.3s ease",
                cursor: "pointer",
                border: "1px solid transparent",
                height: "100%",
                "&:hover": {
                  transform: "translateY(-5px)",
                  borderColor: "#64ffda",
                  boxShadow: "0 20px 30px -15px rgba(2, 12, 27, 0.7)"
                }
              }}>
                <h3 style={{
                  color: "#ccd6f6",
                  fontSize: "1.5rem",
                  marginBottom: "0.5rem"
                }}>
                  {challenge.title}
                </h3>
                <p style={{
                  color: "#8892b0",
                  marginBottom: "1.5rem"
                }}>
                  Contains {challenge.problems.length} problems
                </p>
                <button 
                  onClick={() => setSelectedChallenge(challenge)}
                  style={{
                    backgroundColor: "transparent",
                    border: "1px solid #64ffda",
                    color: "#64ffda",
                    padding: "0.5rem 1rem",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "500",
                    transition: "all 0.3s ease",
                    position: "relative",
                    overflow: "hidden",
                    "&:hover": {
                      backgroundColor: "rgba(100, 255, 218, 0.1)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 5px 15px rgba(100, 255, 218, 0.2)"
                    },
                    "&:active": {
                      transform: "translateY(0)"
                    },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: "0",
                      left: "-100%",
                      width: "100%",
                      height: "100%",
                      background: "linear-gradient(90deg, transparent, rgba(100, 255, 218, 0.4), transparent)",
                      transition: "0.5s"
                    },
                    "&:hover::before": {
                      left: "100%"
                    }
                  }}
                >
                  View Problems
                </button>
              </div>
            ))}
          </div>
        )}

        {selectedChallenge && (
          <div style={{
            backgroundColor: "#112240",
            borderRadius: "8px",
            padding: "2rem",
            boxShadow: "0 10px 30px -15px rgba(2, 12, 27, 0.7)",
            border: "1px solid #1e2a47",
            width: "100%",
            margin: "0 auto"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "2rem",
              flexWrap: "wrap",
              gap: "1rem"
            }}>
              <button 
                onClick={() => setSelectedChallenge(null)}
                style={{
                  backgroundColor: "transparent",
                  border: "1px solid #64ffda",
                  color: "#64ffda",
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontWeight: "500",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "rgba(100, 255, 218, 0.1)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 5px 15px rgba(100, 255, 218, 0.2)"
                  },
                  "&:active": {
                    transform: "translateY(0)"
                  }
                }}
              >
                ← Back to Challenges
              </button>
              <h3 style={{
                color: "#ccd6f6",
                fontSize: "clamp(1.5rem, 4vw, 1.8rem)", // Responsive font size
                margin: 0,
                textAlign: "center",
                flex: 1,
                minWidth: "200px"
              }}>
                {selectedChallenge.title}
              </h3>
              <div style={{
                backgroundColor: "rgba(100, 255, 218, 0.1)",
                color: "#64ffda",
                padding: "0.5rem 1rem",
                borderRadius: "4px",
                fontSize: "0.9rem",
                border: "1px solid #64ffda",
                whiteSpace: "nowrap"
              }}>
                {selectedChallenge.problems.filter(problem => 
                  checkedProblems[selectedChallenge.title]?.[problem.name]
                ).length}/{selectedChallenge.problems.length} Solved
              </div>
            </div>

            <div style={{ overflowX: "auto", width: "100%" }}>
              <table style={{
                width: "100%",
                borderCollapse: "collapse",
                color: "#ccd6f6",
                tableLayout: "fixed"
              }}>
                <thead>
                  <tr style={{
                    backgroundColor: "rgba(100, 255, 218, 0.1)",
                    color: "#64ffda"
                  }}>
                    <th style={{
                      padding: "12px 15px",
                      textAlign: "center",
                      borderBottom: "2px solid #64ffda",
                      width: "10%"
                    }}>S.No</th>
                    <th style={{
                      padding: "12px 15px",
                      borderBottom: "2px solid #64ffda",
                      width: "50%"
                    }}>Problem Name</th>
                    <th style={{
                      padding: "12px 15px",
                      borderBottom: "2px solid #64ffda",
                      width: "20%"
                    }}>Action</th>
                    <th style={{
                      padding: "12px 15px",
                      borderBottom: "2px solid #64ffda",
                      width: "20%"
                    }}>Completed</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedChallenge.problems.map((problem, index) => {
                    const isChecked = checkedProblems[selectedChallenge.title]?.[problem.name];
                    return (
                      <tr key={index} style={{
                        backgroundColor: isChecked ? "rgba(100, 255, 218, 0.05)" : "transparent",
                        borderBottom: "1px solid #1e2a47",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          backgroundColor: "rgba(100, 255, 218, 0.03)"
                        }
                      }}>
                        <td style={{
                          padding: "12px 15px",
                          textAlign: "center",
                          color: "#8892b0",
                          wordWrap: "break-word"
                        }}>
                          {index + 1}
                        </td>
                        <td style={{
                          padding: "12px 15px",
                          color: isChecked ? "#64ffda" : "#ccd6f6",
                          fontWeight: isChecked ? "500" : "normal",
                          wordWrap: "break-word"
                        }}>
                          {problem.name}
                        </td>
                        <td style={{ 
                          padding: "12px 15px",
                          wordWrap: "break-word"
                        }}>
                          <button 
                            onClick={() => window.open(problem.link, "_blank")}
                            style={{
                              backgroundColor: "rgba(100, 255, 218, 0.1)",
                              border: "1px solid #64ffda",
                              color: "#64ffda",
                              padding: "0.25rem 0.75rem",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontWeight: "500",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.25rem",
                              margin: "0 auto",
                              transition: "all 0.3s ease",
                              "&:hover": {
                                backgroundColor: "rgba(100, 255, 218, 0.2)",
                                transform: "translateY(-2px)",
                                boxShadow: "0 5px 15px rgba(100, 255, 218, 0.2)"
                              },
                              "&:active": {
                                transform: "translateY(0)"
                              }
                            }}
                          >
                            ↗ Solve
                          </button>
                        </td>
                        <td style={{ 
                          padding: "12px 15px", 
                          textAlign: "center",
                          wordWrap: "break-word"
                        }}>
                          <input
                            type="checkbox"
                            checked={isChecked || false}
                            onChange={() => handleCheckboxChange(selectedChallenge.title, problem.name)}
                            style={{
                              width: "18px",
                              height: "18px",
                              accentColor: "#64ffda",
                              cursor: "pointer",
                              transform: "scale(1.2)",
                              transition: "transform 0.2s ease",
                              "&:hover": {
                                transform: "scale(1.3)"
                              }
                            }}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChallengePage;