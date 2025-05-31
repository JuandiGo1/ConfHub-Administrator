// src/components/PaginatedList.js
import React, { useRef, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
} from "react-native";

const PaginatedList = ({
  data,
  renderItem,
  itemsPerPage = 10,
  listHeight = 300,
  emptyMessage = "No hay elementos para mostrar",
  handleRefresh,
  refreshing,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const flatListRef = useRef(null);
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIdx = currentPage * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const currentItems = data.slice(startIdx, endIdx);

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      flatListRef.current?.scrollToOffset({ animated: false, offset: 0 });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
      flatListRef.current?.scrollToOffset({ animated: false, offset: 0 });
    }
  };

  return (
    <View style={[styles.container, { height: listHeight }]}>
      {data.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{emptyMessage}</Text>
        </View>
      ) : (
        <>
          <FlatList
            ref={flatListRef}
            data={currentItems}
            renderItem={renderItem}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.listContent}
          />

          <View style={styles.paginationControls}>
            <TouchableOpacity
              onPress={handlePrevPage}
              disabled={currentPage === 0}
              style={[
                styles.paginationButton,
                currentPage === 0 && styles.disabledButton,
              ]}
            >
              <Text style={styles.buttonText}>Anterior</Text>
            </TouchableOpacity>

            <View style={{ flexDirection: "column", alignItems: "center" }}>
              <Text style={styles.pageIndicator}>
                Página {currentPage + 1} de {totalPages}
              </Text>
              <Text style={styles.itemsIndicator}>
                Items{" "}
                {data.length < 10 * (currentPage + 1)
                  ? data.length
                  : 10 * (currentPage + 1)}{" "}
                de {" " + data.length}
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleNextPage}
              disabled={currentPage === totalPages - 1}
              style={[
                styles.paginationButton,
                currentPage === totalPages - 1 && styles.disabledButton,
              ]}
            >
              <Text style={styles.buttonText}>Siguiente</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
  },
  listContent: {
    paddingBottom: 10,
  },
  paginationControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 10,
  },
  paginationButton: {
    padding: 8,
    backgroundColor: "#007AFF",
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: "#cccccc",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  pageIndicator: {
    fontWeight: "bold",
  },
  itemsIndicator: {
    fontSize: 11,
    color: "gray",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#666",
    fontSize: 16,
  },
});

export default PaginatedList;
